export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = `/uploads/${req.file.filename}`;
    const fileUrl = new URL(filePath, `${req.protocol}://${req.get("host")}`).toString();
    res.status(201).json({
      data: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: filePath,
      },
    });
  } catch (error) {
    next(error);
  }
}
