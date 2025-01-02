const { File } = require("../../models/file/file");
const { bucket } = require("../../server");

exports.getFile = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).send("File not found.");
        }

        // Use file metadata to get content type
        const contentType = file.contentType || 'application/octet-stream'; // Default content type if not found

        // Open a download stream using the file's ObjectId
        const downloadStream = bucket.openDownloadStream(file.id);

        downloadStream.on('error', (error) => {
            console.log(error);
            return res.status(500).send("Error occurred while retrieving the file.");
        });

        // Set the content type from the metadata
        res.setHeader('Content-Type', contentType);

        // Pipe the download stream to the response
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error occurred while retrieving the file.");
    }
}