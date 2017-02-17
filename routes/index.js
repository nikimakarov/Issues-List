var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var issue = require('./issue.js');

// Создание соединения к базе данных
var connection = mysql.createConnection({
  host     : 'mysql://mysql:3306/',
  user     : 'user065',
  password : 'e73eVWg4v5VIKWTI',
  database : 'issueList'
});

// Проверка соединения
connection.connect(function(err){
	if(err) console.log('connection error:', err);
});

// Создание таблицы, если она не существует
connection.query(
	"CREATE TABLE IF NOT EXISTS issue ("
     + "id INT(10) NOT NULL AUTO_INCREMENT, "
     + "issue LONGTEXT, "
     + "solution LONGTEXT, "
     + "mark FLOAT(5) DEFAULT 0, "
     + "PRIMARY KEY(id))",
     function(err) {
        if (err) throw err;
        console.log('The table is created');
     }
);

// Страница с таблицей проблем (в зависимости от доступа пользователя)
router.get('/', ensureAuthenticated, function(req, res){
	if (req.user.access == 'change'){
		issue.showForChange(connection, res);
	}
	else {
		issue.showForMark(connection, res);
	}
});

// Подтверждение аутентификации
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('success_msg','Войдите, чтобы просмотреть базу');
		res.redirect('/users/login');
	}
};

// Переход на страницу добавления записи
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add');
});

// Получение данных со страницы добавления записи
router.post('/add', function(req, res){
	var problem = req.body.problem;
	var solution = req.body.solution;

	req.checkBody('problem', 'Название проблемы обязательно').notEmpty();
	req.checkBody('solution', 'Решение проблемы обязательно').notEmpty();
	var errors = req.validationErrors();

	if (errors) {
		res.render('add',{
			errors:errors
		});
	} 
	else 
	{
		req.flash('success_msg', 'Решение проблемы успешно создано');
		issue.add(connection, req, res);
	}
});

// Переход на страницу изменения записи
router.get('/update/*', ensureAuthenticated, function(req, res){
	issue.update(connection, req, res);
});

// Переход на страницу изменения записи
router.post('/update/*', function(req, res){
	req.flash('success_msg', 'Запись была успешно изменена');
	issue.updateDB(connection, req, res);
});

// Удаление записи
router.post('/delete', ensureAuthenticated, function(req, res){
	req.flash('success_msg', 'Запись была успешно удалена');
    issue.delete(connection, req, res);
});

// Оценка записи
router.post('/rate', ensureAuthenticated, function(req, res){
	req.flash('success_msg', 'Запись оценена');
    issue.rate(connection, req, res);
});

module.exports = router;