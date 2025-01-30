import admin from 'firebase-admin';

// Export the function using ES module syntax
export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
