var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/register', function(req, res){
	res.render('register');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var job = req.body.job;
	var access = req.body.access;

	req.checkBody('name', 'Имя обязательно').notEmpty();
	req.checkBody('email', 'Email обязателен').notEmpty();
	req.checkBody('email', 'Неверный формат email').isEmail();
	req.checkBody('username', 'Логин обязателен').notEmpty();
	req.checkBody('password', 'Пароль обязателен').notEmpty();
	req.checkBody('password2', 'Пароли не совпадают').equals(req.body.password);
	req.checkBody('job', 'Должность обязательна').notEmpty();
	req.checkBody('access', 'Выберите права доступа').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} 
	else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			job: job,
			access: access
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Вы зарегистрированы и можете войти');
		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Неизвестный пользователь'});
			}
   			User.comparePassword(password, user.password, function(err, isMatch){
   				if(err) throw err;
					if(isMatch){
						return done(null, user);
					} else {
						return done(null, false, {message: 'Неверный пароль'});
					}
   			});
  	   });
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
    	res.redirect('/');
	}
);

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'Вы вышли');
	res.redirect('/users/login');
});

module.exports = router;