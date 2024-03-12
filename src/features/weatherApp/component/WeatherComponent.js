import React from 'react'
import { Card, Col, Input, Row, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { todayApiCall, todayResponse } from '../reduxStore/weatherSlice';
import { EnvironmentFilled } from '@ant-design/icons';
import './weatherComponent.scss';

const { Search } = Input;

function WeatherComponent() {
    const todayData = useSelector(todayResponse);
    const dispatch = useDispatch();

    const onSearch = (value) => {
        dispatch(todayApiCall(value))
    };

    const currentLocation = (data) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        onSearch(position.coords.latitude + ',' + position.coords.longitude);
    }

    const timeConversion = (data) => {
        var gc = (data).slice(0, 3);
        if (Number(gc) > 12) {
            var temptimeData = Number(gc) - 12 + ' PM'
            return temptimeData
        }
        else if (Number(gc) === 0) {
            return '12 AM'
        }
        else if (Number(gc) === 12) {
            return '12 PM'
        }
        else {
            return Number(gc) + ' AM'
        }
    }

    return (
        <div className='BackgroundColor'>

            <Row className="mainColumn">

                <Col span={12} offset={6}>
                    <Card className='WeatherCardOuter'>
                        <span className='inlineRow'>
                            <Search
                                placeholder="Enter City Name"
                                allowClear
                                enterButton="Search"
                                size="large"
                                onSearch={onSearch}
                            />
                            <EnvironmentFilled style={{ fontSize: '2.5em' }} onClick={currentLocation} />
                        </span>

                        <Row className='information'>
                            <Col span={24} style={{ textAlign: 'center' }} >
                                <h1>{todayData ? todayData.location ? todayData.location.name : '' : ''}</h1>
                            </Col>
                            <Col span={4} offset={2}><img src={todayData ? todayData.current ? todayData.current.condition.icon : '' : ''} alt='weather' /></Col>
                            <Col span={4} >
                                <div><h1>{todayData ? todayData.current ? (todayData.current.temp_c).toFixed() : '' : ''}<span style={{ fontSize: '0.75em' }}>℃</span></h1></div>

                            </Col>
                            <Col span={8}><div>{todayData ? todayData.current ? todayData.current.condition.text : '' : ''}</div></Col>
                            <Col span={6}></Col>
                        </Row>
                        <span>Last Updated : {todayData ? todayData.location ? todayData.location.localtime : '' : ''}</span>
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
                                                            <div><span style={{ fontSize: '0.8em' }}>Feels Like</span><span style={{ fontWeight: '600' }}> {(data.feelslike_c).toFixed()}<span style={{ fontSize: '0.75em' }}>℃</span></span></div>
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
                                                        <div className='thickFont'>{(data.temp_c).toFixed()}℃</div>
                                                        <div><span style={{ fontSize: '0.8em' }}>Feels Like</span><span style={{ fontWeight: '600' }}>  {(data.feelslike_c).toFixed()}℃</span></div>
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
                                                        <div className='thickFont'>{(data.temp_c).toFixed()}℃</div>
                                                        <div><span style={{ fontSize: '0.8em' }}>Feels Like</span><span style={{ fontWeight: '600' }}>  {(data.feelslike_c).toFixed()}℃</span></div>
                                                    </Card>
                                                )) : '' : ''}
                                            </div>
                                    },
                                ]}
                            />
                        </Row>
                    </Card>
                </Col>


            </Row>
        </div >

    )
}

export default WeatherComponent