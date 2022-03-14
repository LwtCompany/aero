const modelUser = require('../models/user');
const TokenBuilder = require('../service/myToken');
const modelFile = require('../models/file');
const multer  = require('multer');
const path = require('path')


const fileStorageEngine = multer.diskStorage({
    destination:(req, file, cb)=> {
        cb(null,path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
       
        cb(null, Date.now() + `--` + file.originalname);
    }
});

const upload =  multer({storage: fileStorageEngine}).single("file");

async function createUser(req, res, next) {
    try {
        const data = await modelUser.create({
            login: req.body.login,
            password: req.body.password
        });
        const tokenData = TokenBuilder.signInToken(data.dataValues);
        res.status(200).send(tokenData);
    } catch (error) {
        res.status(404).send({message: `Error createUser: ${error.name} ${error.message}`});
    }
  
}

async function newToken(req, res, next){
    try {
        const tokenData = await TokenBuilder.refreshToken(req.body.refresh);

        res.send(tokenData);
    } catch (error) {
        res.status(404).send({message: `Error newToken: ${error.name} ${error.message}`});
    }
    
}

async function loginUser(req, res, next){
    try {
        const {login, password} = req.body;

        const data = await modelUser.findOne({
            where: {
                password,
                login
            }
        });
    
        if(!data)
            return res.status(401).send({
                message: 'user not found ',
                data: {}
            });
    
        const tokenData = TokenBuilder.signInToken(data.dataValues);
        res.status(200).send(tokenData);
    } catch (error) {
        res.status(404).send({message: `Error LoginUser: ${error.name} ${error.message}`});
    }
  

}

async function infoUser(req, res, next){
    try {
        const token = req.headers['token'];
        const userInfo = TokenBuilder.userList[token];
    
        if(!userInfo)
            return res.status(404).send({message: 'Sorry info not found', data:{}})
        
        res.status(200).send(userInfo)
    } catch (error) {
        res.status(404).send({message: `Error infoUser: ${error.name} ${error.message}`});
    }
  
   
}

async function fileCreate(req, res, next){
    try {
      
        upload(req, res, async (err) => {
           

            await modelFile.create({
                fileName: req.file.path,
                type: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size
            });
          
            if(err){
                console.log(err);
            } else {
                   
                   if(req.file == undefined){
                     console.log('Error: No File Selected!');          
                   } 
                   else {
                        console.log({
                             msg: 'File Uploaded!',
                        });
                   }
            }
              
         });

        res.status(200).send({
              message: 'success',
              data: {}
        });
    } catch (error) {
        res.status(404).send({message: `Error fileCreate: ${error.name} ${error.message} `});
    }
}

async function getFiles(req, res, next){
    try {
    
        let {list_size = 10, page = 1} = req.query;

        list_size = parseInt(list_size);
        page = parseInt(page);

        let my_offset = (page - 1) * list_size;

        const data = await modelFile.findAll({
            limit: list_size,
            offset: my_offset
        })
      return res.send({message: "Success", data})
    } catch (error) {
        res.status(404).send({message: `Error getFiles: ${error.name} ${error.message} `});
    }
 
}

async function getFile(req, res, next){
    try {
    
        let {id} = req.query;

        const data = await modelFile.findOne({
            where:{
                id
            }
        });

        return res.send({message: "Success", data})
    } catch (error) {
        res.status(404).send({message: `Error getFile: ${error.name} ${error.message} `});
    }
}

const {createWriteStream, createReadStream, unlink} = require('fs');

async function downloadFile(req, res, next){
    try {
        let {id} = req.query;

        const data = await modelFile.findOne({
            where:{
                id
            }
        });

        const readStream = createReadStream(data.fileName);
        const writeStream = createWriteStream(path.join(__dirname, '../downloads/'+ data.type));

        readStream.pipe(writeStream).on('error', console.error);

        res.status(200).send({
            message: 'successfull donwloaded',
            data:{}
        });
     
    } catch (error) {

        res.status(404).send({message: `Error downloadFile: ${error.name} ${error.message} `});
    }
}

async function updateFile(req, res, next){
    try {
        let {id} = req.query;
        let result = {};
        const data = await modelFile.findOne({
            where:{
                id
            }
        });
       
        if(data){
            unlink(data.fileName, (err) => {
                if (err) throw err;
            });
     
            upload(req, res, async (err) => {
                data.fileName = req.file.path;
                data.type = req.file.filename;   
                data.mimeType = req.file.mimetype   
                data.size = req.file.size   
                await data.save();      
                
                result = data;
                
                if(err){
                    console.log(err);
                } else {
                    
                    if(req.file == undefined){
                        console.log('Error: No File Selected!');          
                    } 
                    else {
                        console.log({
                            msg: 'File Uploaded!',
                        });
                    }
                }
                
            });
        }
            

        res.status(200).send({
            message: 'successfull updated',
            data: {}
        });

    } catch (error) {
        res.status(404).send({message: `Error updateFile: ${error.name} ${error.message} `});
    }
}

async function deleteFile(req, res, next){
    try {
        let {id} = req.query;
        const data = await modelFile.findOne({
            where:{
                id
            }
        });
       
        unlink(data.fileName, (err) => {
            if (err) throw err;
        });
        await data.destroy();
        res.status(200).send({message: 'success', data: {}});
        
    } catch (error) {
        res.status(404).send({message: `Error updateFile: ${error.name} ${error.message} `});
    }
}
module.exports = {
    createUser,
    newToken,
    loginUser,
    infoUser,
    fileCreate,
    getFiles,
    getFile,
    downloadFile,
    updateFile,
    deleteFile
}