let params = (new URL(document.location)).searchParams;
let departureCode = params.get('departure');
let arrivalCode = params.get('arrival');
let person = params.get('p');
let type = params.get('t');
let date = params.get('date');
let year = date.split('-')[0];
let month = date.split('-')[1];
let day = date.split('-')[2];

function createElement (tagName, settings, parentElement) {
  let obj = document.createElement(tagName);
  if (settings.class) {
    obj.className = settings.class;
  }
  if (settings.text) {
    let text = document.createTextNode(settings.text);
    obj.appendChild(text);
  }
  if (settings.atr) {
    for (let i = 0; i < settings.atr.length; i++) {
      obj.setAttribute(settings.atr[i][0], settings.atr[i][1]);
    }
  }
  if (document.getElementById(parentElement) instanceof Element) {
    document.getElementById(parentElement).appendChild(obj);
  }
};

fetch(`/api/search?departure=${departureCode}&arrival=${arrivalCode}&date=${date}&p=${person}&t=${type}`)
.then((response) => {
    return response.json();
}).then((data) => {
    if (data.status === 'error') {
      function error (div) {
        document.getElementById(`nav-${div}`).innerHTML = `
        <div class="row" id="error">
          <div class="col-sm-4">
            <img src="pic/alert.svg" id="errorImg">
          </div>
          <div class="col-sm-8" id="errorMessage">
            <b id="sorry">Sorry!</b>
            <p id="errorMsg">${data.error}</p>
          </div>
        </div>`;
      };
      error('price');
      error('time');
      error('departure_time');
      error('arrival_time');
    } else {
      function flight (counter, sort) {
        for (let i = 0; i < data.flight[counter].length; i++) {
          airline_name = data.flight[counter][i].flight[0].airline_name;
          if (data.flight[counter][i].type === 'direct') {
            createElement('div', {atr: [['class','row flightData'],['id',`flightData_${counter}_${i}`]]}, `nav-${sort}`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col1_${counter}_${i}`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row1_${counter}_${i}`]]}, `col1_${counter}_${i}`);
            createElement('div', {atr: [['class', 'airline_img'],['id', `airline_img_${counter}_${i}`]]}, `row1_${counter}_${i}`);
            createElement('img', {atr: [['src', `https://www.gstatic.com/flights/airline_logos/70px/${data.flight[counter][i].flight[0].airline_code}.png`],['style', `width:40px;`]]}, `airline_img_${counter}_${i}`);
            createElement('div', {atr: [['class', 'airline_datail'],['id', `airline_datail_${counter}_${i}`]]}, `row1_${counter}_${i}`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].flightNo}`},  `airline_datail_${counter}_${i}`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].airline_name}`,atr: [['class', 'airline_name']]},  `airline_datail_${counter}_${i}`);
            createElement('div', {atr: [['class', 'col-sm-6'],['style', 'padding:15px;'],['id', `col2_${counter}_${i}`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row2_${counter}_${i}`]]}, `col2_${counter}_${i}`);
            createElement('div', {atr: [['class', 'departure'],['id', `departure_${counter}_${i}`]]}, `row2_${counter}_${i}`);
            createElement('b', {text:`${data.flight[counter][i].flight[0].departure_time}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].departure_portCode}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}`);
            createElement('div', {atr: [['class', 'duration'],['id', `duration_${counter}_${i}`]]}, `row2_${counter}_${i}`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].duration_hour} 小時 ${data.flight[counter][i].flight[0].duration_min} 分鐘`,atr: [['class', 'duration_time']]}, `duration_${counter}_${i}`);
            createElement('div', {atr: [['class', 'duration_line']]}, `duration_${counter}_${i}`);
            createElement('div', {atr: [['class', 'arrival'],['id', `arrival_${counter}_${i}`]]}, `row2_${counter}_${i}`);
            createElement('b', {text:`${data.flight[counter][i].flight[0].arrival_time}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].arrival_portCode}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col3_${counter}_${i}`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'flightPrice'],['id', `flightPrice_${counter}_${i}`]]}, `col3_${counter}_${i}`);
            createElement('p', {text:`NT$ `,atr: [['class', 'flightPrice_dollar']]}, `flightPrice_${counter}_${i}`);
            createElement('b', {text:`${data.flight[counter][i].totalPrice.toLocaleString()}`,atr: [['class', 'flightPrice_price']]}, `flightPrice_${counter}_${i}`);
        } else {
            createElement('div', {atr: [['class','row flightData'],['id',`flightData_${counter}_${i}`]]}, `nav-${sort}`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col1_${counter}_${i}_1`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row1_${counter}_${i}_1`]]}, `col1_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'airline_img'],['id', `airline_img_${counter}_${i}_1`]]}, `row1_${counter}_${i}_1`);
            createElement('img', {atr: [['src', `https://www.gstatic.com/flights/airline_logos/70px/${data.flight[counter][i].flight[0].airline_code}.png`],['style', `width:40px;`]]}, `airline_img_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'airline_datail'],['id', `airline_datail_${counter}_${i}_1`]]}, `row1_${counter}_${i}_1`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].flightNo}`},  `airline_datail_${counter}_${i}_1`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].airline_name}`,atr: [['class', 'airline_name']]},  `airline_datail_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'col-sm-6'],['style', 'padding:15px;'],['id', `col2_${counter}_${i}_1`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row2_${counter}_${i}_1`]]}, `col2_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'departure'],['id', `departure_${counter}_${i}_1`]]}, `row2_${counter}_${i}_1`);
            createElement('b', {text:`${data.flight[counter][i].flight[0].departure_time}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}_1`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].departure_portCode}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'duration'],['id', `duration_${counter}_${i}_1`]]}, `row2_${counter}_${i}_1`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].duration_hour} 小時 ${data.flight[counter][i].flight[0].duration_min} 分鐘`,atr: [['class', 'duration_time']]}, `duration_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'duration_line']]}, `duration_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'arrival'],['id', `arrival_${counter}_${i}_1`]]}, `row2_${counter}_${i}_1`);
            createElement('b', {text:`${data.flight[counter][i].flight[0].arrival_time}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}_1`);
            createElement('p', {text:`${data.flight[counter][i].flight[0].arrival_portCode}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}_1`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col3_${counter}_${i}_1`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'transfer_detail'],['id', `transfer_detail_${counter}_${i}`]]}, `col3_${counter}_${i}_1`);
            createElement('p', {text:`轉機時間: `,atr: [['class', 'transfer_duration']]}, `transfer_detail_${counter}_${i}`);
            createElement('b', {text:`${Math.floor(data.flight[counter][i].transfer_duration/60)} 小時 ${data.flight[counter][i].transfer_duration%60} 分`,atr: [['class', 'transfer_time'],['id', `transfer_time_${counter}_${i}`]]}, `transfer_detail_${counter}_${i}`);
            createElement('br', {}, `transfer_time_${counter}_${i}`);
            createElement('p', {text:`總飛行時間: `,atr: [['class', 'transfer_duration']]}, `transfer_detail_${counter}_${i}`);
            createElement('b', {text:`${Math.floor(data.flight[counter][i].total_duration/60)} 小時 ${data.flight[counter][i].total_duration%60} 分`,atr: [['class', 'transfer_time']]}, `transfer_detail_${counter}_${i}`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col1_${counter}_${i}_2`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row1_${counter}_${i}_2`]]}, `col1_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'airline_img'],['id', `airline_img_${counter}_${i}_2`]]}, `row1_${counter}_${i}_2`);
            createElement('img', {atr: [['src', `https://www.gstatic.com/flights/airline_logos/70px/${data.flight[counter][i].flight[1].airline_code}.png`],['style', `width:40px;`]]}, `airline_img_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'airline_datail'],['id', `airline_datail_${counter}_${i}_2`]]}, `row1_${counter}_${i}_2`);
            createElement('p', {text:`${data.flight[counter][i].flight[1].flightNo}`},  `airline_datail_${counter}_${i}_2`);
            createElement('p', {text:`${data.flight[counter][i].flight[1].airline_name}`,atr: [['class', 'airline_name']]},  `airline_datail_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'col-sm-6'],['style', 'padding:15px;'],['id', `col2_${counter}_${i}_2`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'row'],['id', `row2_${counter}_${i}_2`]]}, `col2_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'departure'],['id', `departure_${counter}_${i}_2`]]}, `row2_${counter}_${i}_2`);
            createElement('b', {text:`${data.flight[counter][i].flight[1].departure_time}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}_2`);
            createElement('p', {text:`${data.flight[counter][i].flight[1].departure_portCode}`,atr: [['class', 'departure_time']]}, `departure_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'duration'],['id', `duration_${counter}_${i}_2`]]}, `row2_${counter}_${i}_2`);
            createElement('p', {text:`${data.flight[counter][i].flight[1].duration_hour} 小時 ${data.flight[counter][i].flight[1].duration_min} 分鐘`,atr: [['class', 'duration_time']]}, `duration_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'duration_line']]}, `duration_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'arrival'],['id', `arrival_${counter}_${i}_2`]]}, `row2_${counter}_${i}_2`);
            createElement('b', {text:`${data.flight[counter][i].flight[1].arrival_time}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}_2`);
            createElement('p', {text:`${data.flight[counter][i].flight[1].arrival_portCode}`,atr: [['class', 'arrival_time']]}, `arrival_${counter}_${i}_2`);
            createElement('div', {atr: [['class', 'col-sm-3'],['style', 'padding:15px;'],['id', `col3_${counter}_${i}_2`]]}, `flightData_${counter}_${i}`);
            createElement('div', {atr: [['class', 'flightPrice'],['id', `flightPrice_${counter}_${i}_2`]]}, `col3_${counter}_${i}_2`);
            createElement('p', {text:`NT$ `,atr: [['class', 'flightPrice_dollar']]}, `flightPrice_${counter}_${i}_2`);
            createElement('b', {text:data.flight[counter][i].totalPrice.toLocaleString(),atr: [['class', 'flightPrice_price']]}, `flightPrice_${counter}_${i}_2`);
          }
        };
      };
      flight(0, 'price');
      flight(1, 'time');
      flight(2, 'departure_time');
      flight(3, 'arrival_time');
    }
  }).catch((error) => {
    console.log({
      error: error
    });
  });
