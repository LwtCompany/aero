const express = require('express');
const router = express.Router();
const guardRoutes = require('../config/token.config');
const {
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
} = require('../controllers')

router.post('/signup', createUser)
router.post('/signin/new_token', newToken)

router.post('/signin', loginUser)

router.use(guardRoutes())

router.get('/info', infoUser);

router.post('/file/upload', fileCreate);
router.post('/file/update', updateFile);
router.post('/file/delete', deleteFile);

router.get('/file/list', getFiles);
router.get('/file', getFile);
router.get('/file/download', downloadFile);
router.post('/logout', newToken);

router.use('*', (req, res, next) => {
    return res.status(404)
         .send('Sorry page not found!  :(404');
});

module.exports = router;