exports.saveFile = async (file, File, Readable, bucket) => {
    const { originalname, mimetype, buffer } = file;
    let uploadStream = bucket.openUploadStream(originalname, {
        contentType: mimetype
    });
    let readBuffer = new Readable();
    readBuffer.push(buffer);
    readBuffer.push(null);
    // Pipe the buffer to GridFS
    await new Promise((resolve, reject) => {
        readBuffer.pipe(uploadStream)
            .on('finish', resolve)
            .on('error', reject);
    });
    newFile = new File({
        filename: originalname,
        contentType: mimetype,
        length: buffer.length,
        id: uploadStream.id
    });
    let savedFile = await newFile.save();
    return newFile
}