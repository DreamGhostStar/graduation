import { Badge, Calendar, DatePicker, Input, message, Modal, Space, Table, Select, Button, Alert } from 'antd'
import React, { ChangeEvent, useCallback, useEffect, useState, KeyboardEvent } from 'react'
import styles from './style.module.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import { addScheduleApi, alterScheduleApi, getScheduleListApi, IGetScheduleListResponse, IScheduleItem, removeScheduleApi } from 'api/schedule';
import { httpSuccessCode } from 'consts';
import { ColumnsType } from 'antd/lib/table';

moment.locale('zh-cn');
const { Option } = Select;

export default function Schedule() {
    let changed = false;
    const [date, setDate] = useState(moment(moment().format("YYYY-MM-DD")))
    const [scheduleList, setScheduleList] = useState<IGetScheduleListResponse>({})
    const [selectedScheduleList, setSelectedScheduleList] = useState<IScheduleItem[]>([])
    const [visible, setVisible] = useState(false)
    const [statusList, setStatusList] = useState<boolean[]>([])
    const [type, setType] = useState('success')
    const [recordTime, setRecordTime] = useState(moment(moment().format("YYYY-MM-DD")))
    const [inputValue, setInputValue] = useState('')
    const columns: ColumnsType<IScheduleItem> = [
        {
            title: '日期',
            dataIndex: 'record_time',
            key: 'record_time',
            render: (value: string) => {
                return (
                    <div>
                        {moment(new Date(parseInt(value))).format("YYYY-MM-DD hh:mm:ss")}
                    </div>
                )
            }
        },
        {
            title: '描述',
            dataIndex: 'content',
            key: 'content',
            render: (value: string, record, index) => {
                return (
                    <>
                        {
                            statusList[index]
                                ? <Input
                                    value={value}
                                    onChange={(event) => { handleChangeInput(event, index) }}
                                    onPressEnter={(event) => handlePressEnter(event, record, index)}
                                />
                                : <p>{value}</p>
                        }
                    </>
                )
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_value: string, record, index) => {
                return (
                    <Space size="middle">
                        <div
                            onClick={() => { alterScheduleItem(index) }}
                            className={styles.operation_text}
                        >
                            {statusList[index] ? '取消' : '修改'}
                        </div>
                        <div
                            className={styles.operation_text}
                            onClick={() => handleRemove(record, index)}
                        >
                            删除
                        </div>
                    </Space>
                )
            },
        },
    ];
    // 处理删除子项的逻辑
    const handleRemove = async (item: IScheduleItem, index: number) => {
        const { code, message: msg } = await removeScheduleApi({
            id: item.id
        });

        if (code === httpSuccessCode) {
            message.success('删除成功');
            selectedScheduleList.splice(index, 1);
            setSelectedScheduleList([...selectedScheduleList])
        } else {
            message.error(msg)
        }
    }
    // 提交
    const handlePressEnter = async (event: KeyboardEvent<HTMLInputElement>, item: IScheduleItem, index: number) => {
        const value = event.currentTarget.value;
        const { code, message: msg } = await alterScheduleApi({
            id: item.id,
            content: value
        });
        if (code === httpSuccessCode) {
            message.success('修改成功');
            statusList[index] = false;
            setStatusList([...statusList])
        } else {
            message.error(msg)
        }
    }
    // 监听日程子项的输入框变化情况
    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value;
        selectedScheduleList[index].content = value;
        setSelectedScheduleList([...selectedScheduleList])
    }
    // 修改日程子项的状态
    const alterScheduleItem = (index: number) => {
        statusList[index] = !statusList[index];
        setStatusList([...statusList])
    }
    const getScheduleList = useCallback(async () => {
        const { code, data, message: msg } = await getScheduleListApi({
            year: date.year(),
            month: date.month() + 1
        });
        if (code === httpSuccessCode) {
            setScheduleList(data)
        } else {
            message.error(msg);
        }
    }, [date])

    const onPanelChange = (value: moment.Moment) => {
        changed = true;
        setDate(value)
        setTimeout(() => {
            changed = false;
        }, 100);
    };

    // 选择日
    const dateCellRender = (value: moment.Moment) => {
        const key = `${value.month() + 1}-${value.date()}`;
        const listData = scheduleList[key] || [];
        return (
            <ul className="events">
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge
                            status={item.type}
                            text={item.content}
                        />
                    </li>
                ))}
            </ul>
        );
    }

    const getMonthData = (value: moment.Moment) => {
        if (value.month() === 8) {
            return 1394;
        }
    }

    // 选择月
    const monthCellRender = (value: moment.Moment) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    }
    const handleSelect = (value: moment.Moment) => {
        if (changed) {
            return;
        }
        setDate(value)
        setVisible(true);
        const updateSelectedScheduleList = scheduleList[`${value.month() + 1}-${value.date()}`] || [];
        setSelectedScheduleList(updateSelectedScheduleList)
        setStatusList(new Array(updateSelectedScheduleList.length).fill(false))
    }
    // 日期选择器变化事件
    const onDatePickerChange = (value: moment.Moment | null) => {
        if (value) {
            setRecordTime(value);
        }
    }
    // 下拉框变化事件
    const handleSelectChange = (value: string) => {
        setType(value);
    }
    // 清除函数
    const clear = () => {
        setInputValue('');
        setRecordTime(moment(moment().format("YYYY-MM-DD")));
        setType('success')
    }
    // 新增
    const handleAddScheduleItem = async () => {
        const {code, data, message: msg} = await addScheduleApi({
            type,
            content: inputValue,
            recordTime: recordTime.valueOf().toString()
        });

        if (code === httpSuccessCode) {
            message.success('增加成功');
            setSelectedScheduleList([
                ...selectedScheduleList,
                data
            ]);
            clear();
        } else {
            message.error(msg);
        }
    }
    useEffect(() => {
        getScheduleList();
    }, [date, getScheduleList])

    return (
        <div className={styles.layout}>

            <Alert
                message={`You selected date: ${date && date.format('YYYY-MM-DD')}`}
            />
            <div className={styles.calendar_layout}>
                <Calendar
                    locale={zh_CN}
                    value={date}
                    onPanelChange={onPanelChange}
                    dateCellRender={dateCellRender}
                    monthCellRender={monthCellRender}
                    onSelect={handleSelect}
                />
            </div>
            <Modal
                visible={visible}
                footer={null}
                width={800}
                onCancel={() => setVisible(false)}
                bodyStyle={{
                    padding: 0
                }}
            >
                <div className={styles.schedule_layout}>
                    <div>
                        <h3>{date.format('YYYY-MM-DD')}</h3>
                        <div className={styles.date_picker_layout}>
                            <DatePicker
                                className={styles.date_picker}
                                picker='time'
                                value={recordTime}
                                onChange={onDatePickerChange}
                            />
                            <Select
                                value={type}
                                style={{ width: 120 }}
                                onChange={handleSelectChange}
                            >
                                <Option value="success">松弛</Option>
                                <Option value="warning">常规</Option>
                                <Option value="error">紧急</Option>
                            </Select>
                            <Input
                                className={styles.input}
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                            />
                            <Button type='primary' onClick={handleAddScheduleItem}>新增</Button>
                        </div>
                    </div>
                    <div className={styles.main}>
                        <Table
                            columns={columns}
                            dataSource={selectedScheduleList}
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
