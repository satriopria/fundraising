const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token
function verifyToken(req, res, next) {
  const token = req.cookies.token; // Mengambil token dari cookie

  if (!token) {
    return res.redirect('/login'); // Redirect ke login jika tidak ada token
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verifikasi token
    req.user = decoded; // Menyimpan data pengguna dari token ke req.user
    next(); // Lanjutkan ke handler berikutnya
  } catch (error) {
    console.error(error.message);
    return res.redirect('/login'); // Redirect jika token tidak valid atau expired
  }
}

module.exports = verifyToken;