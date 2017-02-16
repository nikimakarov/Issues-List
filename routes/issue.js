// Выборка данных (Пользователь 1)
exports.showForChange = function(db, res) {
    db.query("SELECT * FROM issue", [], function(err, rows) {
        if (err) throw err;
        res.render('issues', {issues : rows});
    });
};

// Выборка данных (Пользователь 2)
exports.showForMark = function(db, res) {
    db.query("SELECT * FROM issue", [], function(err, rows) {
        if (err) throw err;
        res.render('issues-mark', {issues : rows});
    });
};

// Добавление данных (Пользователь 1)
exports.add = function(db, req, res) {
    let issue = req.body.problem;
    let solution = req.body.solution;
    db.query(
        "INSERT INTO issue (issue, solution, mark) VALUES(?, ?, ?)",
        [issue, solution, 0],
        function(err) {
            if (err) throw err;
            res.redirect('/');
        }
    )
};

// Удаление данных (Пользователь 1)
exports.delete = function(db, req, res) {
    let id = req.body['delete'];
    db.query(
        "DELETE FROM issue WHERE id=?",
        [id],
        function(err) {
            if (err) throw err;
            res.redirect('/');
        }
    )
};

// Обновление данных (Пользователь 1)
exports.update = function(db, req, res) {
    let id = req.query.id;
    let problem = {};
    db.query(
        "SELECT issue, solution FROM issue WHERE id=?",
        [id],
        function(err, rows) {
            if (err) throw err;
            problem.issue = rows[0].issue;
            problem.solution = rows[0].solution;
            problem.id = id;
            res.render('update', { problem: problem });
        }
    )
};

// Добавление данных (Пользователь 1)
exports.updateDB = function(db, req, res) {
    let issue = req.body.issue;
    let solution = req.body.solution;
    let id = req.query.id;
    db.query(
        "UPDATE issue SET issue=?, solution=? WHERE id=?",
        [issue, solution, id],
        function(err) {
            if (err) throw err;
            res.redirect('/');
        }
    )
};

// Оценка данных (Пользователь 2)
exports.rate = function(db, req, res) {
    let mark = req.body.rate;
    let id = req.body.id;
    db.query(
        "UPDATE issue SET mark=? WHERE id=?",
        [mark, id],
        function(err) {
            if (err) throw err;
            res.redirect('/');
        }
    )
};