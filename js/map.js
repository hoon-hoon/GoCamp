import { loadKakaoMap } from './loadMap.js';
import { fetchCampingData, getCampingDataFromLoc } from './api.js';
import { updateSideNav, openSideNav, displayNearCampingData } from './sideNav.js';

let map;
let markers = [];
let activeOverlay = null;
export const getMap = () => map;

loadKakaoMap().then(async () => {
    const loadingSpinner = document.querySelector('.loadingSpinner');
    loadingSpinner.style.display = 'block';
    const container = document.getElementById('kakaoMap');
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 8
    };

    map = new kakao.maps.Map(container, options);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const curLocation = new kakao.maps.LatLng(latitude, longitude);
            map.setCenter(curLocation);

            const nearCampingData = await getCampingDataFromLoc(latitude, longitude);
            console.log(nearCampingData);

            displayNearCampingData(nearCampingData);
        });
    } else {
        console.log("근처 캠핑장 조회 실패");
    }


    const campingData = await fetchCampingData();
    addMarkers(campingData);

    loadingSpinner.style.display = 'none';
});

// 마커 찍는 함수
function addMarkers(data) {
    var imageSrc = './asset/marker.svg';
    var imageSize = new kakao.maps.Size(32, 32);
    var imageOption = { offset: new kakao.maps.Point(16, 32) };

    data.forEach((item, index) => {
        const markerPosition = new kakao.maps.LatLng(item.mapY, item.mapX);
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        // 마커 생성
        const marker = new kakao.maps.Marker({
            position: markerPosition,
            title: item.facltNm,
            image: markerImage
        });

        // 커스텀 오버레이
        var overlayContent = document.createElement('div');
        overlayContent.className = 'label';
        overlayContent.innerHTML = `<span>${item.facltNm}</span>`;
        var overlay = new kakao.maps.CustomOverlay({
            content: overlayContent,
            position: markerPosition,
            yAnchor: 2.2
        });

        marker.setMap(map);
        markers.push(marker);

        overlay.setMap(map);

        const activateOverlay = () => {
            if (activeOverlay) {
                activeOverlay.classList.remove('active');
            }
            overlayContent.classList.add('active');
            activeOverlay = overlayContent;
        };

        // 오버레이 클릭 이벤트
        overlayContent.addEventListener('click', () => {
            map.panTo(markerPosition); // panTo -> 지도 focus 부드럽게 이동
            updateSideNav(item);
            openSideNav();
            activateOverlay(); // 오버레이 활성화
        });

        kakao.maps.event.addListener(marker, 'click', () => {
            map.panTo(markerPosition);
            updateSideNav(item);
            openSideNav();
            activateOverlay();
        });

    });
}

// select

const regions = [
    { value: '서울특별시', name: '서울특별시' },
    { value: '부산광역시', name: '부산광역시' },
    { value: '대구광역시', name: '대구광역시' },
    { value: '인천광역시', name: '인천광역시' },
    { value: '광주광역시', name: '광주광역시' },
    { value: '대전광역시', name: '대전광역시' },
    { value: '울산광역시', name: '울산광역시' },
    { value: '세종특별자치시', name: '세종특별자치시' },
    { value: '경기도', name: '경기도' },
    { value: '강원도', name: '강원도' },
    { value: '충청북도', name: '충청북도' },
    { value: '충청남도', name: '충청남도' },
    { value: '전라북도', name: '전라북도' },
    { value: '전라남도', name: '전라남도' },
    { value: '경상북도', name: '경상북도' },
    { value: '경상남도', name: '경상남도' },
    { value: '제주특별자치도', name: '제주특별자치도' },
];

const regionCoordinates = {
    '서울특별시': { lat: 37.5665, lng: 126.9780 },
    '부산광역시': { lat: 35.1796, lng: 129.0756 },
    '대구광역시': { lat: 35.8714, lng: 128.6014 },
    '인천광역시': { lat: 37.4563, lng: 126.7052 },
    '광주광역시': { lat: 35.1595, lng: 126.8526 },
    '대전광역시': { lat: 36.3504, lng: 127.3845 },
    '울산광역시': { lat: 35.5399, lng: 129.3114 },
    '세종특별자치시': { lat: 36.4800, lng: 127.2890 },
    '경기도': { lat: 37.4138, lng: 127.5183 },
    '강원도': { lat: 37.8228, lng: 128.1555 },
    '충청북도': { lat: 36.6357, lng: 127.4913 },
    '충청남도': { lat: 36.5184, lng: 126.8005 },
    '전라북도': { lat: 35.7175, lng: 127.1530 },
    '전라남도': { lat: 34.8679, lng: 126.9910 },
    '경상북도': { lat: 36.4919, lng: 128.8889 },
    '경상남도': { lat: 35.4606, lng: 128.2132 },
    '제주특별자치도': { lat: 33.4996, lng: 126.5312 },
};

const regionSelect = document.querySelector('.regionSelect');

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = '지역';
regionSelect.appendChild(defaultOption);

// 배열을 순회하며 option 요소 생성
regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region.value;
    option.textContent = region.name;
    regionSelect.appendChild(option);
});

// 선택한 지역으로 지도 이동
regionSelect.addEventListener('change', (event) => {
    const selectedRegion = event.target.value;
    if (selectedRegion && regionCoordinates[selectedRegion]) {
        const { lat, lng } = regionCoordinates[selectedRegion];
        const moveLatLon = new kakao.maps.LatLng(lat, lng);
        map.setCenter(moveLatLon);
        map.setLevel(9);
    }
});