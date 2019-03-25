//Passw
//S7EQR-lF7d8-dZnj8-ic4Y0
//Api key
//c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063
//web:
//https://min-api.cryptocompare.com/documentation?api_key=c4ad201d6bb020c79570dd44ebd66defd1471014b87bd336c89abbc22d9c2063

const minute = 60000;
const FS = require("fs");

function GO(timeStart,timeEnd,PorogPersent,change,interval,base,consolelog){
	const dayLenght=86400000
	
	var axios = require('axios')
	axios
	    .get('https://api.coincap.io/v2/candles?exchange=binance&interval='+
	    	interval+'&baseId='+base+'&quoteId='+change+
	    	'&start='+timeStart+'&end='+timeEnd)
	    .then(
	      value => {
	        info = value.data.data;
	        console.log(consolelog)
	        Persent(info)
	        // console.log(info)        
	      },reason => {
	      	D=new Date();
	      	console.log('')
	      	FS.appendFileSync("errorParse.txt",D.toString()+'\n'+consolelog+'\n'+reason+'\n')
	      }
	    );

	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'kuksenko.artem@gmail.com',
	        pass: '&789456123&'
	    }
	});



	function Persent(info){
		console.log(info);
		// старая модель вычисления
		// let P =(info[info.length-1].open-info[info.length-2].open)*100/info[info.length-2].open
		let P =(info[info.length-1].close-info[info.length-1].open)*100/info[info.length-1].close
		console.log(P);

		//прирост по обьему в процентах
		let Dprice =(info[info.length-1].volume-info[info.length-2].volume)*100/info[info.length-2].volume
		
		if(P>=PorogPersent){
		// if(P==P){
			var time = new  Date();
			time.setTime(timeEnd);
			var now = new Date();
			var candelTime = new Date();
			candelTime.setTime(info[info.length-1].period)
			const mailOptions = {
			  from: 'kuksenko.artem@gmail.com', // sender address
			  to: ['tema.kuxeko@yandex.ru','boba2621@yandex.ru'], // list of receivers
			   // to: 'tema.kuxenko@yandex.ru', // list of receivers
			  subject: 'Crpt '+ base +' :'+P.toFixed(2).toString()+', Интервал:'+interval, // Subject line
			  html: '<p>Crypto '+consolelog.toString()+' Процент : '+ P.toFixed(2).toString() +'</p>'+
			  		'<p> Текущая цена:'+info[info.length-1].close+'</p>'+
			  		'<p>%прироста обьема: '+Dprice.toFixed(3).toString()+'<p><h1>Служебная информация:</h1>'+
			  		'<p>Время свечи:'+candelTime.toString()+'</p>'+
			  		'<p>Время когда запросили свечу: '+time.getHours()+':'+time.getMinutes()+'</p>'+
			  		'<p>Время когда отправляли почту: '+now.getHours()+':'+now.getMinutes()+'</p>'+
			  		'<p>Полное время когда запросили свечу:'+time.toString()+'</p>'
			};
			sendMail(mailOptions)
		}
	}


	// console.log("% - ",Persent())
	function sendMail(mailOptions){
		transporter.sendMail(mailOptions, function (err, info) {
		   if(err) {
		    D=new Date();
	      	FS.appendFileSync("errorMail.txt",D.toString()+'\n'+consolelog+'\n'+err+'\n')
		   }else
		     console.log(info);
		});
	}
}

const fs = require("fs");
// const PorogPersent=0.9
interval = 'm15'
change = 'bitcoin'
// base = 'ethereum'
// change = 'trx'

var T=true;
r3()
// coin = [
// 	[]
// ]

// start timers
setInterval(r3, minute*3);
	function r3(){
		var now = +new Date();
		timeEnd = now.toString();
		timeStart = (now-minute*60).toString();
		look(timeStart,timeEnd,'m5',1);
	}

setInterval(r10, minute*10);
	function r10(){
		var now = +new Date();
		timeEnd = now.toString();
		timeStart = (now-minute*60).toString();
		look(timeStart,timeEnd,'m15',1);
		// look('m30',1);
	}

setInterval(r15, minute*15);
	function r15(){
		var now = +new Date();
		timeEnd = now.toString();
		timeStart = (now-minute*60).toString();
		look(timeStart,timeEnd,'m30',1);
		look(timeStart,timeEnd,'h1',1);
		look(timeStart,timeEnd,'h2',1);

		D = new Date();
		D=D.getHours();
		// console.log("сейчас - ",D,ty);
		if(D==20){
		// console.log('run test mess',T)
			if(T==true) {
				testMess();
			}
			T=false;
		}else{
			T=true;  
		}
	}


function look(timeStart,timeEnd,interval,PorogPersent){

	GO(timeStart,timeEnd,PorogPersent,change,interval,'tron','run tron (TRX)')

	GO(timeStart,timeEnd,PorogPersent,change,interval,'ripple','run XRP (ripple)') 

	GO(timeStart,timeEnd,PorogPersent,change,interval,'stellar','run XLM (stellarlumens)')

	GO(timeStart,timeEnd,PorogPersent,change,interval,'verge','run XVG (verge)')

	GO(timeStart,timeEnd,PorogPersent,change,interval,'zilliqa','run ZIL (zilliqa)')

	GO(timeStart,timeEnd,PorogPersent,change,interval,'cardano','run ADA (cardano)')
}

function testMess(){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport({
	 service: 'gmail',
	 auth: {
	        user: 'kuksenko.artem@gmail.com',
	        pass: '&789456123&'
	    }
	});
	const mailOptions = {
		from: 'kuksenko.artem@gmail.com', // sender address
		to: ['tema.kuxeko@yandex.ru','boba2621@yandex.ru'], // list of receivers
			   // to: 'kuksenko.artem@gmail.com', // list of receivers
		subject: 'Crypto test message', // Subject line
		html: '<p> короч я живой, а ты? </p>'// plain text body
	};
	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     console.log(info);
	});
}