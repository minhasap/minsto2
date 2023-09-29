const isLogin = (req, res, next) => {
    try {
        if (req.session.email) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log('error is admin isLogin', error.message);
    }
};

const isLogout = (req, res, next) => {
    try {
        if (req.session.email) {
            res.redirect('/admin/home');
        } else {
            next();
        }
    } catch (error) {
        console.log('admin isLogout ERROR');
    }
};

module.exports = {
    isLogin,
    isLogout
};
