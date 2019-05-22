let lib = require('../util/lib.js');
const supertest = require('supertest');
const api = supertest('http://localhost:3000/api');
const { expect } = require('chai');
let assert = require('assert');

describe ('Test statistics function', () => {
  it ('測試統計航班資料', () => {
    assert.deepEqual(lib.statistics([1000, 2000]), [1500, 1000, 2000, 1500, 2]);
    assert.deepEqual(lib.statistics([1000, 2000, 3000]), [2000, 1000, 3000, 2000, 3]);
    assert.deepEqual(lib.statistics(), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics([]), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics(null), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics(NaN), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics('test'), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics(100), [0, 0, 0, 0, 0]);
    assert.deepEqual(lib.statistics({ object: 100 }), [0, 0, 0, 0, 0]);
  });
});

describe ('Test SEARCH API', () => {
  it ('測試 SEARCH API_0', (done) => {
    api.get('/search?departure=TPE&arrival=HKG&date=2019-05-14&p=1&t=direct')
      .expect(200)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body).includes.all.keys(['status', 'flight'])
        expect(res.body.status).to.equal('success');
        expect(res.body.flight).with.lengthOf(4);
        expect(res.body.flight[0][0].flight[0]).includes.all.keys(['flightNo', 'departure_code', 'arrival_code', 'cabinClass', 'arrival_portName', 'airline_name'])
        expect(res.body.flight[0][0]).to.have.property('total_duration');
        expect(res.body.flight[0][0].total_duration).to.be.a('number');
        expect(res.body.flight[0][0].flight).to.be.an.instanceof(Array);
        done();
      });
  });
  it ('測試 SEARCH API_1', (done) => {
    api.get('/search?departure=TPE&arrival=NYC&date=2019-05-14&p=1&t=transfer')
      .expect(200)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body).includes.all.keys(['status', 'flight'])
        expect(res.body.status).to.equal('success');
        expect(res.body.flight).with.lengthOf(4);
        expect(res.body.flight[0][0].type).to.equal('transfer');
        expect(res.body.flight[0][0].flight).to.be.an.instanceof(Array);
        expect(res.body.flight[0][0].flight).with.lengthOf(2);
        expect(res.body.flight[0][0].flight[0]).includes.all.keys(['flightNo', 'departure_code', 'arrival_code', 'cabinClass', 'arrival_portName', 'airline_name'])
        expect(res.body.flight[0][0]).to.have.property('total_duration');
        expect(res.body.flight[0][0].total_duration).to.be.a('number');
        done();
      });
  });
  it ('測試 SEARCH API_2', (done) => {
    api.get('/search?departure=efewfewf&arrival=HKG&date=2019-05-14&p=1&t=direct')
      .expect(200)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body).includes.all.keys(['status', 'flight'])
        expect(res.body.status).to.equal('error');
        expect(res.body.flight).to.equal('沒有找到相關飛行航班，<br>請調整其他搜索範圍。');
        done();
      });
  });
  it ('測試 SEARCH API_3', (done) => {
    api.get('/search?departure=TPE&arrival=HKG&date=2019-08-14&p=1&t=direct')
      .expect(200)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body).includes.all.keys(['status', 'flight'])
        expect(res.body.status).to.equal('error');
        expect(res.body.flight).to.equal('沒有找到相關飛行航班，<br>請調整其他搜索範圍。');
        done();
      });
  });
  it ('測試 SEARCH API_4', (done) => {
    api.get('/search?departure=TPE&arrival=HKG&date=2893021847149021&p=1&t=direct')
      .expect(200)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body).includes.all.keys(['status', 'flight'])
        expect(res.body.status).to.equal('error');
        expect(res.body.flight).to.equal('沒有找到相關飛行航班，<br>請調整其他搜索範圍。');
        done();
      });
  });
});
