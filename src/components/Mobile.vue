<template>
  <div>
  
  <!-- sudo sysctl fs.inotify.max_user_watches=524288 -->

  <div id="inf">
    <h1>Ищем памп</h1>
    Курс {{base}} по отношению к {{change}}<br><br>
    <div id="inputBlock">
      <p>введите валюту</p>
      <input type="text" @input="newV($event.target.value)" value="ethereum"> или выберете из списка 
      <select @input="newV($event.target.value)">
          <option>ethereum</option>
          <option>tron</option>
          <option>stellar</option>
          <option>verge</option>
          <option>zilliqa</option>
          <option>cardano</option>
        </select> 
      <br>
      <p>введите временной отрезок поиска</p>
      <input type="date" @input="newTimeStart($event.target.value)">
      <input type="date" @input="newTimeEnd($event.target.value)">
      <p>введите тип свечи
        <select @input="selectTimeSet($event.target.value)">
          <option>m30</option>
          <option>m5</option>
          <option>m15</option>
          <option>h1</option>
        </select>
      </p>
      <p>Введите % роста цены</p>
      <input type="text" @input="setPorogPercent($event.target.value)">
      <p>Введите % роста объемов</p>
      <input type="text" @input="setPorogVolumePercent($event.target.value)">
  <!--     <p>Количество свечей выводимых на дисплей</p>
      <input type="text"> -->
      <p>
        <button @click="main()">Рассчитать</button>
      </p>
    </div>
    <!-- <p>{{info}}</p> -->
    <div id="flexDiv">
      <div id="cryptoOutput" v-for="data in dataArray">
        <div id="tabblock"></div>
        <p>{{data.date.day}}:{{data.date.month}}:{{data.date.year}}</p>
        <p>{{data.time.hours}}:{{data.time.minutes}}</p>
        <p>прирост цены %:{{data.percent}}</p>
        <p>прирост объёма в % :{{data.increase}}</p>
        <p>цена: {{data.price}}</p>
        <!-- <DataChart time="Живи "/> -->
      </div>
    </div>
  </div>
  <div id="chart_div"></div>
  
  </div>
</template>

<script>

import {GoogleCharts} from 'google-charts'
import axios from 'axios'
import DataChart from './avarageComponent.vue'

export default {
  components:{
    DataChart
  },
  data(){
    return {
      info: null,
      dataArray: [],
      change: 'bitcoin',
      interval: 'm30',
      intervalMilliseconds: 360000,
      base:'ethereum',
      timeStart:'1551599885000',
      timeEnd:'1551686584000',
      porogPercent:0,
      volume:0
    }
  },

  name: 'Main',

  methods: {
    setPorogVolumePercent(p){
      this.volume=p;
    },

    newTimeStart(d){
      let year = parseInt(d[0]+d[1]+d[2]+d[3]);
      let month = parseInt(d[5]+d[6])-1;
      let day = parseInt(d[8]+d[9]);
      var time = new Date();
      time.setTime(0);
      time.setYear(year);
      time.setMonth(month);
      time.setDate(day);
      this.timeStart=+time;
    },

    newTimeEnd(d){
      let year = parseInt(d[0]+d[1]+d[2]+d[3]);
      let month = parseInt(d[5]+d[6])-1;
      let day = parseInt(d[8]+d[9]);
      var time = new Date();
      time.setTime(0);
      time.setYear(year);
      time.setMonth(month);
      time.setDate(day);
      this.timeEnd=+time;
    },

    selectTimeSet(timeLength){
      const minute = 60000;
      this.interval=timeLength;

      switch(timeLength){
        case "m30":this.intervalMilliseconds = 30*minute; break;
        case "m15":this.intervalMilliseconds = 15*minute; break;
        case "m5":this.intervalMilliseconds = 5*minute; break;
        case "h1":this.intervalMilliseconds = 60*minute; break;
      }
    },

    newV(v){
      this.base=v;
    },

    setPorogPercent(p){
      this.porogPercent=parseFloat(p);
    },

    main(){
      this.calc(this.timeStart, this.timeEnd, this.porogPercent,
        this.change, this.interval, this.base, 'лог консоли');
    },

    calc(timeStart, timeEnd, porogPercent,change, interval, base, consolelog){
      const dayLenght=86400000;
      console.log(
        'https://api.coincap.io/v2/candles?exchange=binance&interval='+
        interval+'&baseId='+base+'&quoteId='+change+'&start='+timeStart+'&end='
        +timeEnd
      );
      
      axios
        .get('https://api.coincap.io/v2/candles?exchange=binance&interval='+
          interval+'&baseId='+base+'&quoteId='+change+'&start='+timeStart+'&end='+timeEnd)
        .then(
          value => {
            let info = value.data.data;
            this.percent(info);
            console.log(info);      
          },reason => {
            alert(reason);
          }
        );
    },

    percent(info){
      this.info = info;
      let dataArr=new Array;
      console.log("info.lenght", info.length)

      for(let i = 1;i<info.length;i++){
        let p = (info[i].close-info[i].open)/info[i].close*100;
        let pVolume = (info[i].volume-info[i-1].volume)/
                      info[i-1].volume*100;
        
        if ((p>this.porogPercent)&&(pVolume>this.volume)){
          let d = new Date();
          d.setTime(info[i].period)

          dataArr.push({
            percent:p.toFixed(2),
            // date:d,
            date:{
              month:d.getMonth(),
              year:d.getYear(),
              day:d.getDay()
            },
            time:{
              minutes:d.getMinutes(),
              hours:d.getHours()
            },
            increase: ((info[i].volume-info[i-1].volume)/
              info[i-1].volume*100).toFixed(3),
            price: info[i].close
          });
        }
      }

      this.dataArray=dataArr;
    }
  },   

  mounted(){//по загрузке
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


#flexDiv{
  display: -webkit-flex; 
  display: inline-flex; 
  flex-direction: column; 
}

  #cryptoOutput{
/*grid-template-rows:1fr;*/
/*grid-column: 1;*/
    color: rgb(52, 230, 16);
    background: rgb(16, 4, 43);
    width: 600px;
    /*border:5px;*/
    position: relative;
    /*left: 50%;*/
    /*transform: translate(-50%, 0%);*/
    text-align: left;
    padding-left:15px; 
  }

  #inputBlock{
    background: grey;
    color: black;
  /*margin:5px;*/
    
      padding: 5px;
    /*margin: 5px;*/
    /*border: 50px;*/

  }
  #tabblock{
    height: 10px;
    background: black;
  }
  #chart_div{
    margin:0px;
    /*width: 850px;*/
    position: relative;

  }
  #inf {
    /*padding: 5px;*/
    /*margin:0px;*/
    background: black;
    color: rgb(52, 230, 16);
    position: relative;
      /*padding: 0px;*/
    /*margin: 0px;*/
    /*border: 0px;*/
  }
  h3 {
    /*margin: 40px 0 0;*/
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    /*margin: 0 10px;*/
  }
  a {
    color: #42b983;
  }
</style>
