import React, { useEffect } from 'react'
import { Card, Col, Input, Row, Tabs, Layout, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { todayApiCall, todayResponse, responseRejected } from '../reduxStore/weatherSlice';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import moment from 'moment';
import './Weather.scss'

const { Search } = Input;
const { Header } = Layout;

function Weather() {
    const todayData = useSelector(todayResponse);
    const rejectedResponse = useSelector(responseRejected);

    const dispatch = useDispatch();


    const onSearch = (value) => {
        dispatch(todayApiCall(value))
    };
    useEffect(() => {
        // Your code here
        onSearch('Canada')
    }, []);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.open({
            message: 'Notification',
            description: 'Please Enter a Valid City Name',
        });
    }

    useEffect(() => {
        if (rejectedResponse !== null) {
            console.log('ams', rejectedResponse);
            openNotification()
        }
    }, [rejectedResponse])

    const showPosition = (position) => {
        onSearch(position.coords.latitude + ',' + position.coords.longitude);
    }

    const currentLocation = (data) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const timeConversion = (data) => {
        var gc = (data).slice(0, 3);
        if (Number(gc) > 12) {
            var temptimeData = (Number(gc) - 12) + data.slice(3,) + ' PM'
            return temptimeData
        }
        else if (Number(gc) === 0) {
            return '12' + data.slice(3,) + 'AM'
        }
        else if (Number(gc) === 12) {
            return '12' + data.slice(3,) + 'PM'
        }
        else {
            return Number(gc) + data.slice(3,) + ' AM'
        }
    }

    return (
        <div>
            <Header className="header">
                <img src='weather.png' alt='logo' style={{ height: '39px', marginRight: '1vh' }} ></img><span className='logoFont'>Forecastify</span>
            </Header>

            <Card className='CardExterior'>
                <Row className='outerRow'>
                    {/* Left Column */}
                    <Col span={18} xl={18} xs={24}>
                        {contextHolder}
                        <div className='searchBar'>
                            <Search
                                placeholder="Enter City Name"
                                allowClear
                                enterButton="Search"
                                size="large"
                                onSearch={onSearch}
                                className='searchinput'
                            />
                            <img src='location.png' className='searchIcon' onClick={currentLocation} alt='userLocation' />
                        </div>
                        {/* Location Name */}
                        <div className='loactionHeader'>
                            <h1>{todayData ? todayData.location ? todayData.location.name + ' , ' + todayData.location.region : '' : ''}</h1>
                            <h2> {todayData ? todayData.location ? moment(todayData.location.localtime).format('MMM DD , YYYY') : '' : ''}</h2>
                        </div>
                        <Row>
                            {/* Weather Details Left */}
                            <Col span={11} xl={11} xs={24}>
                                <Card className='rightCard'>
                                    <Row style={{ textAlign: 'center', alignItems: 'center' }}>
                                        <Col span={12} className='temperature'>
                                            <h1 >{todayData ? todayData.current ? (todayData.current.temp_c).toFixed() : '' : ''}<span style={{ fontSize: '0.75em' }}>℃</span></h1>
                                            <div>{todayData ? todayData.current ? todayData.current.condition.text : '' : ''}</div>
                                        </Col>
                                        <Col span={12}>
                                            <img src={todayData ? todayData.current ? todayData.current.condition.icon : '' : ''} alt='weather' />
                                        </Col>

                                    </Row>
                                    <Row className='extraDetails'>
                                        <span> Wind Speed : <b style={{ color: '#fca121' }}>{todayData ? todayData.current ? todayData.current.wind_kph : 0 : 0} </b>km/h</span>
                                        <span>| Air Pressure : <b style={{ color: '#fca121' }}>{todayData ? todayData.current ? todayData.current.pressure_in : 0 : 0}</b> in</span>
                                        <span>| Percipitation : <b style={{ color: '#fca121' }}>{todayData ? todayData.current ? todayData.current.precip_in : 0 : 0}</b> in</span>
                                    </Row>
                                </Card>
                            </Col>
                            {/* Weather Details Right */}
                            <Col span={11} offset={1} xl={{span:11,offset:1}} xs={{span:24,offset:0}}>
                                <Card className='progressCard'>
                                    <Row style={{ textAlign: 'center'}}>
                                        <Col span={8}>
                                            <CircularProgressbar value={todayData ? todayData.current ? todayData.current.uv : 0 : 0} maxValue={11} text={`${todayData ? todayData.current ? todayData.current.uv : 0 : 0}`} />
                                            <div className='progressText'> UV Index </div>
                                        </Col>
                                        <Col span={8}>
                                            <CircularProgressbar value={todayData ? todayData.current ? todayData.current.humidity : 0 : 0} text={`${todayData ? todayData.current ? todayData.current.humidity : 0 : 0}%`} />
                                            <div className='progressText'> Humidity </div>
                                        </Col>
                                        <Col span={8}>
                                            <CircularProgressbar value={todayData ? todayData.current ? todayData.current.cloud : 0 : 0} text={`${todayData ? todayData.current ? todayData.current.cloud : 0 : 0}%`} />
                                            <div className='progressText'> Cloud Coverage </div>
                                        </Col>
                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                        {/* Tab Pane */}
                        <Row className='cardRow'>
                            <Tabs
                                defaultActiveKey="1"
                                items={[
                                    {
                                        label: `Today`,
                                        key: '1',
                                        children:
                                            <div className='weatherCardLine'>
                                                {todayData ? todayData.forecast ? todayData.forecast.forecastday[0].hour.map(data => {
                                                    if ((data.time).slice(10,) >= (todayData.current.last_updated).slice(10,)) {
                                                        return <Card className='WeatherCard'>
                                                            <div className='timeText'>{timeConversion((data.time).slice(10,))}</div>
                                                            <div className='smallFont'>{data.condition.text}</div>
                                                            <div><img src={data.condition.icon} alt={data.condition.text} /></div>
                                                            <div className='thickFont'>{(data.temp_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></div>
                                                            <div><span style={{ fontSize: '0.8em', color: '#0d57a2' }}>Feels Like</span><span style={{ fontWeight: '600', color: '#fca121' }}> {(data.feelslike_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></span></div>
                                                        </Card>
                                                    }
                                                    else {
                                                        return null
                                                    }

                                                }) : '' : ''}
                                            </div>
                                    },
                                    {
                                        label: `Tommorow`,
                                        key: '2',
                                        children:
                                            <div className='weatherCardLine'>
                                                {todayData ? todayData.forecast ? todayData.forecast.forecastday[1].hour.map(data => (
                                                    <Card className='WeatherCard'>
                                                        <div className='timeText'>{timeConversion((data.time).slice(10,))}</div>
                                                        <div className='smallFont'>{data.condition.text}</div>
                                                        <div><img src={data.condition.icon} alt={data.condition.text} /></div>
                                                        <div className='thickFont'>{(data.temp_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></div>
                                                        <div><span style={{ fontSize: '0.8em', color: '#0d57a2' }}>Feels Like</span><span style={{ fontWeight: '600', color: '#fca121' }}>  {(data.feelslike_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></span></div>
                                                    </Card>
                                                )) : '' : ''}
                                            </div>

                                    },
                                    {
                                        label: `Overmorrow`,
                                        key: '3',
                                        children:
                                            <div className='weatherCardLine'>
                                                {todayData ? todayData.forecast ? todayData.forecast.forecastday[2].hour.map(data => (
                                                    <Card className='WeatherCard'>
                                                        <div className='timeText'>{timeConversion((data.time).slice(10,))}</div>
                                                        <div className='smallFont'>{data.condition.text}</div>
                                                        <div><img src={data.condition.icon} alt={data.condition.text} /></div>
                                                        <div className='thickFont'>{(data.temp_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></div>
                                                        <div><span style={{ fontSize: '0.8em', color: '#0d57a2' }}>Feels Like</span><span style={{ fontWeight: '600', color: '#fca121' }}>  {(data.feelslike_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></span></div>
                                                    </Card>
                                                )) : '' : ''}
                                            </div>
                                    },
                                ]}
                            />
                        </Row>
                    </Col>
                    {/* Right Column  */}
                    <Col span={6} xl={6} xs={24} className='secondColumn'>
                        {/* First Card  */}
                        <Card className='secColumnFirstCard'>
                            <Row>
                                <Col span={12} style={{ color: 'rgb(16 77 165 / 82%)', fontWeight: '600' }}>
                                    <div>Country</div>
                                    <div>Latitude</div>
                                    <div>Longitude</div>
                                    <div>Last Updated</div>
                                </Col>
                                <Col span={4}>
                                    <div>:</div>
                                    <div>:</div>
                                    <div>:</div>
                                    <div>:</div>
                                </Col>
                                <Col span={8} style={{ color: '#04488d' }}>
                                    <div><b>{todayData ? todayData.location ? todayData.location.country : '' : ''}</b></div>
                                    <div><b>{todayData ? todayData.location ? todayData.location.lat : '' : ''}</b></div>
                                    <div><b>{todayData ? todayData.location ? todayData.location.lon : '' : ''}</b></div>
                                    <div><b>{todayData ? todayData.current ? timeConversion((todayData.current.last_updated).slice(10,)) : '' : ''}</b></div>
                                </Col>
                            </Row>
                        </Card>
                        {/* Second Card  */}
                        <Card className='suncard'>
                            <img src='sun-calculator.png' alt='sunrise' className='sunRiseImage'></img>
                            <Row style={{ textAlign: 'center' }}>
                                <Col span={8}>
                                    <div className='sunriseText'>Sunrise</div> <div className='sunriseTextDetails'>{todayData ? todayData.forecast ? todayData.forecast.forecastday[0].astro.sunrise : '' : ''}</div>
                                </Col>
                                <Col span={8}></Col>
                                <Col span={8}>
                                    <div className='sunriseText'>Sunset</div><div className='sunriseTextDetails'>{todayData ? todayData.forecast ? todayData.forecast.forecastday[0].astro.sunset : '' : ''}</div>
                                </Col>
                            </Row>
                        </Card>
                        {/* Third Card  */}
                        <Card className='suncard'>
                            <img src='moon-calculator.png' alt='moonrise' className='sunRiseImage'></img>
                            <Row style={{ textAlign: 'center' }}>
                                <Col span={8}>
                                    <div className='sunriseText'>Moonrise</div> <div className='sunriseTextDetails'>{todayData ? todayData.forecast ? todayData.forecast.forecastday[0].astro.moonrise : '' : ''}</div>
                                </Col>
                                <Col span={8}></Col>
                                <Col span={8}>
                                    <div className='sunriseText'>Moonset</div> <div className='sunriseTextDetails'>{todayData ? todayData.forecast ? todayData.forecast.forecastday[0].astro.moonset : '' : ''}</div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                </Row>

            </Card>
        </div>
    )
}

export default Weather