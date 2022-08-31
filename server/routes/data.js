const express = require('express');
const router = express.Router();
//mysql 서버 연결입니다.

const mysql = require('mysql');
const dbconfig = require('../config/database.js');
const connection = mysql.createConnection(dbconfig);

connection.connect();

router.get('/seoulsmap', (req, res) => {
	var sql = `select * from Marker WHERE title LIKE '%서울%' OR city LIKE '%서울%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}

		return res.send(rows);
	});
});

router.post('/detailSlide', (req, res) => {
	var usercity = req.body.city;
	let usercitys = usercity.split(' ', 2);
	var sql = `select * from photo_data WHERE PHOTOGRAPY_LOCATION LIKE '%${usercitys}%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}

		return res.send(rows);
	});
});

router.post('/detailsi', (req, res) => {
	var usercity = req.body.city;
	
	
	let usercitys = usercity.split(' ', 2);
	console.log(usercity);
	
	var sql=`SELECT DAY_NAME, avg(PER_CNT) AS PER_CNT FROM signgu_data WHERE CODE LIKE '1%' and NAME LIKE '%${usercitys[1]}%' GROUP BY DAY_CODE ORDER BY DAY_CODE;`;
    var sql1 = ``
	connection.query(sql + sql1, (err, results,rows) => {
		
		if (err) {
			return res.send(err);
		}
		var sql_result = results[0];
		var sql1_result = results[1];
        
        let bodypi=[parseInt(sql_result[0].PER_CNT),parseInt(sql_result[1].PER_CNT),parseInt(sql_result[2].PER_CNT),parseInt(sql_result[3].PER_CNT),parseInt(sql_result[4].PER_CNT),parseInt(sql_result[5].PER_CNT),parseInt(sql_result[6].PER_CNT)];
		
		console.log(bodypi);
		console.log(sql1_result);
		return res.send(bodypi);
	});
});

router.post('/aimap', (req, res) => {
	var AIcontent = req.body.ainame;
	let AIcontents = {
		ainame: req.body.ainame,
		ainame1: req.body.ainame1,
		ainame2: req.body.ainame2,
		ainame3: req.body.ainame3,
		ainame4: req.body.ainame4,
	};
	var sql = `SELECT * FROM Marker WHERE title LIKE '%${AIcontent}%' OR tag_1 LIKE '%${AIcontent}%' OR tag_2 LIKE '%${AIcontent}%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		}
		return res.send(rows);
	});
});

router.get('/busansmap', (req, res) => {
	var sql = `select * from Marker WHERE title LIKE '%부산%' OR city LIKE '%부산%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}

		return res.send(rows);
	});
});

router.get('/jejusmap', (req, res) => {
	var sql = `select * from Marker WHERE title LIKE '%제주%' OR city LIKE '%제주%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}

		return res.send(rows);
	});
});

router.get('/dramasmap', (req, res) => {
	var sql = `select * from Marker WHERE title LIKE '%드라마%' OR tag_1 LIKE '%드라마%' OR tag_2 LIKE '%드라마%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}

		return res.send(rows);
	});
});

router.get('/Componentpage', (req, res) => {
	var sql = 'select * from Marker';
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		} else {
			return res.send(rows);
		}
	});
});

router.post('/Searchpage', (req, res) => {
	var userSearch = req.body.search;
	var sql = `SELECT * FROM Marker WHERE title LIKE '%${userSearch}%' OR tag_1 LIKE '%${userSearch}%' OR tag_2 LIKE '%${userSearch}%'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		} else {
			return res.send(rows);
		}
	});
});

router.get('/Searchpage', (req, res) => {
	var sql = `select distinct tag_1 from Marker union select distinct tag_2 from Marker;`;
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		} else {
			return res.send(rows);
		}
	});
});

router.post('/Detail/:id', (req, res) => {
	var userNum = req.body.Num;
	var sql = `SELECT * FROM Marker WHERE num = ${userNum}`;
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		} else {
			return res.send(rows);
		}
	});
});



router.get('/SeoulRanking', (req, res) => {
	var sql = `select DISTINCT NAME from signgu_data where DAY_CODE = 2 and CODE like '1%' order by PER_CNT desc;`
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}	
		return res.send(rows);
	});
});
router.post('/SeoulRankinginfo', (req, res) => {

	var sql1 = `select * from Marker where city REGEXP '서울' && city REGEXP '${req.body.rankingObject[0].NAME}';`;
	var sql2 = `select * from Marker where city REGEXP '서울' && city REGEXP '${req.body.rankingObject[1].NAME}';`;
	var sql3 = `select * from Marker where city REGEXP '서울' && city REGEXP '${req.body.rankingObject[2].NAME}';`;
	var sql4 = `select * from Marker where city REGEXP '서울' && city REGEXP '${req.body.rankingObject[3].NAME}';`;
	var sql5 = `select * from Marker where city REGEXP '서울' && city REGEXP '${req.body.rankingObject[4].NAME}';`;
	var sql = sql1 + sql2 + sql3 + sql4 +sql5
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}
		let Rank = []
		let i, j
		for (i = 0; i<5; i++){
			for (j = 0; rows[i][j] != null; j++ ){
				Rank.push(rows[i][j]);
			}
		}
		return res.send(Rank);
	});
});



router.get('/BusanRanking', (req, res) => {
	var sql = `select DISTINCT NAME from signgu_data where DAY_CODE = 2 and CODE like '26%' order by PER_CNT desc;`
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}	
		return res.send(rows);
	});
});
router.post('/BusanRankinginfo', (req, res) => {

	var sql1 = `select * from Marker where city REGEXP '부산' && city REGEXP '${req.body.rankingObject[0].NAME}';`;
	var sql2 = `select * from Marker where city REGEXP '부산' && city REGEXP '${req.body.rankingObject[1].NAME}';`;
	var sql3 = `select * from Marker where city REGEXP '부산' && city REGEXP '${req.body.rankingObject[2].NAME}';`;
	var sql4 = `select * from Marker where city REGEXP '부산' && city REGEXP '${req.body.rankingObject[3].NAME}';`;
	var sql5 = `select * from Marker where city REGEXP '부산' && city REGEXP '${req.body.rankingObject[4].NAME}';`;
	var sql = sql1 + sql2 + sql3 + sql4 +sql5
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}
		let Rank = []
		let i, j
		for (i = 0; i<5; i++){
			for (j = 0; rows[i][j] != null; j++ ){
				Rank.push(rows[i][j]);
			}
		}
		return res.send(Rank);
	});
});



router.get('/JejuRanking', (req, res) => {
	var sql = `select DISTINCT NAME from signgu_data where DAY_CODE = 2 and CODE like '5%' order by PER_CNT desc;`
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}	
		return res.send(rows);
	});
});
router.post('/JejuRankinginfo', (req, res) => {

	var sql1 = `select * from Marker where city REGEXP '제주' && city REGEXP '${req.body.rankingObject[0].NAME}';`;
	var sql2 = `select * from Marker where city REGEXP '제주' && city REGEXP '${req.body.rankingObject[1].NAME}';`;
	var sql3 = `select * from Marker where city REGEXP '제주' && city REGEXP '${req.body.rankingObject[2].NAME}';`;
	var sql4 = `select * from Marker where city REGEXP '제주' && city REGEXP '${req.body.rankingObject[3].NAME}';`;
	var sql5 = `select * from Marker where city REGEXP '제주' && city REGEXP '${req.body.rankingObject[4].NAME}';`;
	var sql = sql1 + sql2 + sql3 + sql4 +sql5
	connection.query(sql, (err, rows) => {
		if (err) {
			return res.send(err);
		}
		let Rank = []
		let i, j
		for (i = 0; i<5; i++){
			for (j = 0; rows[i][j] != null; j++ ){
				Rank.push(rows[i][j]);
			}
		}
		return res.send(Rank);
	});
});


router.post('/ModalSlider', (req, res) => {
	var nums = req.body.nums;
	//var sql = `SELECT * FROM Marker WHERE num='${nums}' union SELECT num, marker_num, imageSrc,1,2,3,4,5,6 FROM slide WHERE marker_num='${nums}'`;
	var sql = `SELECT num, marker_num, imageSrc FROM slide WHERE marker_num='${nums}'`;
	connection.query(sql, (err, rows) => {
		if (err) {
			console.log('실패');
			return res.send(err);
		} else {
			return res.send(rows);
		}
	});
});

module.exports = router;