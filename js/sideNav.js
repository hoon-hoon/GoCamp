import { searchCampingData } from './api.js';

const sideNav = document.querySelector('.sideNav');
const toggleButton = document.querySelector('.toggleButton');
const toggleText = toggleButton.querySelector('span');

// 토글버튼의 위치가 항상 sideNav의 위에 위치하도록
const updateToggleButtonPosition = () => {
    const sideNavHeight = sideNav.getBoundingClientRect().height;
    toggleButton.style.bottom = `${sideNavHeight + 10}px`;
};

toggleButton.addEventListener('click', () => {
    openSideNav();
});

export const openSideNav = () => {
    if (sideNav.classList.contains('open')) {
        sideNav.classList.remove('open');
        toggleButton.classList.remove('open');
        toggleText.textContent = '목록 열기';
        updateToggleButtonPosition();
    } else {
        sideNav.classList.add('open');
        toggleButton.classList.add('open');
        toggleText.textContent = '목록 닫기';

        // 매번 sideNav의 높이가 달라 toggleButton의 높이를 sideNav에 맞추어 계산해야하는데, 그 과정에서 불가피한 지연시간
        setTimeout(() => {
            updateToggleButtonPosition();
        }, 200);
    }
};


export const updateSideNav = (item) => {
    const infoSection = document.querySelector('.info');

    const unavail = item.animalCmgCl.includes('불가능') ? 'unavailable' : 'available';

    infoSection.innerHTML = `
        <h2 class="name">${item.facltNm}</h2>
        <div class="infoHead">
            <img class="thumbnail" src="${item.firstImageUrl}" alt="${item.facltNm}" />
            <div class="infoHead_p">
                <p class="address">${item.addr1}</p>
                <p class="description">${item.intro}</p>
            </div>
        </div>
        <p class="link">
            <img class="icon" src="./asset/home.svg" />
            <strong>홈페이지</strong> <a href="${item.homepage}" target="_blank">${item.homepage} </a>
        </p>
        <p class="operating-hours">
            <img class="icon" src="./asset/hours.svg" />
            <strong>현재운영여부</strong> ${item.operDeCl || '정보 없음'}
        </p>
        <p class="directions">
            <img class="icon" src="./asset/direction.svg" />
            <strong>오시는 길</strong> ${item.direction || '정보 없음'}
        </p>
        <p class="reservation">
            <img class="icon" src="./asset/reservation.svg" />
            <strong>예약방법</strong> <a href="${item.resveUrl}" target="_blank">${item.resveCl}</a>
        </p>
        <p class="facilities">
            <img class="icon" src="./asset/facilities.svg" />
            <strong>내부시설</strong> ${item.caravInnerFclty || '정보 없음'}
        </p>
        <p class="tools">
            <img class="icon" src="./asset/tools.svg" />
            <strong>취사도구</strong> ${item.sbrsCl || '정보 없음'}
        </p>
        <p class="pets ${unavail}">
            <img class="icon" src="./asset/pets.svg" />
            <strong>애완견 가능 여부</strong> ${item.animalCmgCl || '정보 없음'}
        </p>
    `;
};

export const handleSearch = async () => {
    const searchInput = document.querySelector('.searchBar input');
    const searchResultsList = document.querySelector('.search-results');
    const keyword = searchInput.value.trim();

    if (keyword) {
        const results = await searchCampingData(keyword);

        // 검색 결과를 최대 50개까지만 리스트로 표시
        searchResultsList.innerHTML = results.slice(0, 50).map(item => `
            <li data-id="${item.contentId}">${item.facltNm}</li>
        `).join('');

        // 리스트 내 요소 클릭 이벤트
        document.querySelectorAll('.search-results li').forEach(item => {
            item.addEventListener('click', () => {
                const selectedId = item.getAttribute('data-id');
                const selectedItem = results.find(result => result.contentId === selectedId);

                // SideNav 업데이트
                updateSideNav(selectedItem);
                searchResultsList.innerHTML = '';
            });
        });
    } else {
        alert('검색어를 입력하세요.');
    }
};
document.querySelector('.searchBar button').addEventListener('click', handleSearch);
document.querySelector('.searchBar input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
