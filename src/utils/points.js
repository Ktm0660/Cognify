import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export async function ensureUserData(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, { pointsTotal: 0, gameHistory: {} }, { merge: true });
  } else {
    const data = snap.data() || {};
    const update = {};
    if (data.pointsTotal === undefined) update.pointsTotal = 0;
    if (data.gameHistory === undefined) update.gameHistory = {};
    if (Object.keys(update).length) {
      await setDoc(userRef, update, { merge: true });
    }
  }
}

export async function hasPlayedVersion(userId, game, versionId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  const data = snap.data();
  return !!(data.gameHistory && data.gameHistory[game] && data.gameHistory[game][versionId]);
}

export async function addPoints(userId, game, points, versionId) {
  await ensureUserData(userId);
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    pointsTotal: increment(points),
    [`gameHistory.${game}.${versionId}`]: {
      points,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function awardPoints(userId, game, points, versionId) {
  if (!userId || points <= 0) return;
  const alreadyPlayed = await hasPlayedVersion(userId, game, versionId);
  if (alreadyPlayed) return;
  await addPoints(userId, game, points, versionId);
}

export async function getTotalPoints(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return 0;
  const data = snap.data();
  return data.pointsTotal || 0;
}
