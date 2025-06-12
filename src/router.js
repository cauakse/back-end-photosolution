import { Router } from "express";
import multer from "multer";
import sharp from "sharp"
import fs from "fs";
import path from "path";
import archiver from "archiver"

const FILES_DIR = path.join('/tmp', 'files');
const TEMP_DIR = path.join('/tmp', 'temp');

// Garante que os diretórios existam
fs.mkdirSync(FILES_DIR, { recursive: true });
fs.mkdirSync(TEMP_DIR, { recursive: true });

const upload = multer({ dest: TEMP_DIR });

const router = Router();

router.post("/fotos",upload.array('fotos',100),async (req,res)=>{
    // Enable CORS for this route
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try{
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "Nenhuma foto foi enviada." });
        }

        const existingFiles = await fs.promises.readdir(FILES_DIR);
        if (existingFiles.length > 0) {
            req.files.forEach(file => fs.unlinkSync(file.path));
            return res.status(400).json({ 
                error: "Já existem fotos armazenadas. Faça o download das fotos existentes antes de enviar novas."
            });
        }

        let i = 0;
        const compressPromises = req.files.map(async (file) => {
      const destPath = path.join(FILES_DIR, `${Date.now()}-${++i}.jpeg`);
      await sharp(file.path)
        .jpeg({ quality: 70 })
        .toFile(destPath);
      fs.unlinkSync(file.path);
    });

    await Promise.all(compressPromises);
    res.status(200).json({ message: "Fotos recebidas, comprimidas e salvas!" });

    }catch(error){
        res.status(500).json({ error: "Erro ao processar imagens.", details: error.message });
    }
})

router.get("/existe",(req,res)=>{
    // Enable CORS for this route
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    fs.readdir(FILES_DIR, (err,files)=>{
        if (err) return res.status(500).json({ error: "Erro ao acessar pasta de fotos." });

        if (files.length === 0) 
            return res.status(404).json({ message: "Nenhuma foto disponível." });
        return res.status(200).json({ message: "Há fotos disponíveis." });
    })
})

router.get("/fotos", (req,res)=>{
    // Enable CORS for this route
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    fs.readdir(FILES_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "Erro ao acessar pasta de fotos." });

    if (files.length === 0) return res.status(404).json({ message: "Nenhuma foto disponível." });

    const zip = archiver("zip", { zlib: { level: 9 } });
    res.attachment("fotos.zip");
    zip.pipe(res);

    files.forEach(file => {
      const filePath = path.join(FILES_DIR, file);
      zip.file(filePath, { name: file });
    });

    zip.finalize().then(() => {
      files.forEach(file => fs.unlinkSync(path.join(FILES_DIR, file))); // limpa pasta
    });
  });
})

export default router;