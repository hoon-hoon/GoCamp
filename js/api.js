import { CAMP_API_KEY } from "./config.js";

const baseUrl = `http://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=${CAMP_API_KEY}&numOfRows=400&pageNo=1&MobileOS=ETC&MobileApp=test&_type=json`;

export const fetchCampingData = async () => {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data.response);
        return data.response.body.items.item;
    } catch (error) {
        console.error('에러 발생:', error);
        return [];
    }
};

const searchBaseUrl = `http://apis.data.go.kr/B551011/GoCamping/searchList?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=Test&serviceKey=${CAMP_API_KEY}&_type=json`;

export const searchCampingData = async (keyword) => {
    try {
        const url = `${searchBaseUrl}&keyword=${encodeURIComponent(keyword)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.response.body.items.item;
    } catch (error) {
        console.error('검색 중 오류 발생:', error);
        return [];
    }
};
