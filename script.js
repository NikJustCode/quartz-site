const initialBenefits = [
    {
        title: "ИЗНОСОСТОЙКОСТЬ",
        description: "Обладает исключительной износостойкостью с защитным слоем толщиной 0,3-0,55 мм, который принимает на себя все внешние воздействия, сохраняя декоративный слой в сохранности на весь срок службы покрытия",
        image: "./img/wearResistance.png"
    },
    {
        title: "ЭКОЛОГИЧНОСТЬ",
        description: "Напольные покрытия не выделяют летучих органических соединений, не нагреваются и не содержат токсичных и канцерогенных веществ",
        image: "./img/ecologi.png"
    },
    {
        title: "РЕАЛИСТИЧНОСТЬ",
        description: "Декоративный слой, созданный в качестве HD и эффективная текстура на поверхности создает ощущение структуры внутреннего образца породы древесины, камня, травертина, гранита, мрамора и других поверхностей",
        image: "./img/realistic.png"
    },
    {
        title: "ЗВУКОИЗОЛЯЦИЯ",
        description: "Хорошо гасит ударный шум и создает акустический комфорт в вашем интерьере без создания эффекта эха. В ассортименте есть плитка с дополнительной звукоизоляцией подложкой",
        image: "./img/soundInsulation.png"
    },
    {
        title: "ПРОСТОТА МОНТАЖА",
        description: "Легко монтируется на пол отопления с фанерным или наливным основанием с помощью нанесения расходных материалов и рекомендованной технологии укладки. Нормально функционирует в диапазоне температур от -15 до +27 С в жилой зоне",
        image: "./img/simplicity.png"
    },
    {
        title: "ТЕПЛОПРОВОДНОСТЬ",
        description: "Ощущается как комфортное покрытие без эффекта холодный пол. Можно использовать вместе с системами подогрева «тёплый пол»",
        image: "./img/thermalConductivity.png"
    }
];

if (!localStorage.getItem('initialDataLoaded')) {
    localStorage.setItem('benefits', JSON.stringify(initialBenefits));
    localStorage.setItem('initialDataLoaded', 'true');
}

function loadBenefits() {
    const storedBenefits = localStorage.getItem('benefits');
    return storedBenefits ? JSON.parse(storedBenefits) : initialBenefits;
}

function saveBenefits(benefits) {
    localStorage.setItem('benefits', JSON.stringify(benefits));
}

function renderBenefits() {
    const benefits = loadBenefits();
    const wrapper = document.getElementById('benefits-wrapper');
    
    wrapper.innerHTML = '';
    
    benefits.forEach(benefit => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
            <div class="benefit-card">
                <img src="${benefit.image}" alt="${benefit.title}">
                <h3>${benefit.title}</h3>
                <p>${benefit.description}</p>
            </div>
        `;
        
        wrapper.appendChild(slide);
    });
    
    initBenefitsSlider();
}

function initBenefitsSlider() {
    const sliderWrapper = document.querySelector('.benefits-swiper .swiper-wrapper');
    const prevBtn = document.querySelector('.benefits-swiper .swiper-button-prev');
    const nextBtn = document.querySelector('.benefits-swiper .swiper-button-next');
    
    let currentSlide = 0;
    let slideWidth = 300;
    let slideMargin = 20;
    let visibleSlides = getVisibleSlidesCount();
    let totalSlides = sliderWrapper.children.length;
    
    function getVisibleSlidesCount() {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 1200) return 4;
        if (windowWidth >= 992) return 3;
        if (windowWidth >= 690) return 2;
        return 1;
    }
    
    function setSlideWidths() {
        const containerWidth = document.querySelector('.benefits-swiper').offsetWidth;
        visibleSlides = getVisibleSlidesCount();
        
        slideWidth = Math.floor((containerWidth - (visibleSlides - 1) * slideMargin) / visibleSlides);
        
        const slides = sliderWrapper.children;
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.width = `${slideWidth}px`;
            slides[i].style.marginRight = `${slideMargin}px`;
        }
        
        const hasEnoughSlides = totalSlides > visibleSlides;
        prevBtn.style.display = hasEnoughSlides ? 'flex' : 'none';
        nextBtn.style.display = hasEnoughSlides ? 'flex' : 'none';
        
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (currentSlide > maxSlide) {
            currentSlide = maxSlide;
        }
        
        updateSliderPosition();
    }
    
    function updateSliderPosition() {
        if (totalSlides <= visibleSlides) {
            sliderWrapper.style.transform = 'translateX(0)';
            return;
        }
        
        const offset = -currentSlide * (slideWidth + slideMargin);
        sliderWrapper.style.transform = `translateX(${offset}px)`;
        
        updateButtonsState();
    }
    
    function updateButtonsState() {
        if (totalSlides <= visibleSlides) {
            prevBtn.classList.add('swiper-button-disabled');
            nextBtn.classList.add('swiper-button-disabled');
            return;
        }
        
        prevBtn.classList.toggle('swiper-button-disabled', currentSlide <= 0);
        
        const maxSlide = totalSlides - visibleSlides;
        nextBtn.classList.toggle('swiper-button-disabled', currentSlide >= maxSlide);
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSliderPosition();
        }
    });
    
    totalSlides = sliderWrapper.children.length;
    setSlideWidths();
    
    window.addEventListener('resize', function() {
        setSlideWidths();
    });
}

function generateFileName(file) {
    return `user_img_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsDataURL(file);
    });
}

function showNotification(id) {
    const notification = document.getElementById(id);
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3500);
}

function highlightElement(element) {
    element.classList.add('highlight');
    setTimeout(() => {
        element.classList.remove('highlight');
    }, 1000);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initForm() {
    const form = document.getElementById('add-benefit-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const imageFile = document.getElementById('image').files[0];
        
        if (!imageFile) {
            const imageInput = document.getElementById('image');
            highlightElement(imageInput.parentElement);
            return;
        }
        
        try {
            const dataURL = await fileToDataURL(imageFile);
            
            const benefits = loadBenefits();
            
            benefits.push({
                title: title,
                description: description,
                image: dataURL
            });
            
            saveBenefits(benefits);
            
            form.reset();
            
            showNotification('notification-add');
            highlightElement(form);
            
            renderBenefits();
            
            scrollToTop();
            
        } catch (error) {
            console.error('Ошибка:', error.message);
            highlightElement(form);
        }
    });
}

function initServicesSlider() {
    const sliderWrapper = document.querySelector('.services-swiper .swiper-wrapper');
    const prevBtn = document.querySelector('.services-navigation .swiper-button-prev');
    const nextBtn = document.querySelector('.services-navigation .swiper-button-next');
    
    let currentSlide = 0;
    let slideWidth = 300;
    let slideMargin = 20;
    let visibleSlides = getVisibleSlidesCount();
    let totalSlides = sliderWrapper.children.length;
    
    function getVisibleSlidesCount() {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 992) return 3;
        if (windowWidth >= 690) return 2;
        return 1;
    }
    
    function setSlideWidths() {
        const containerWidth = document.querySelector('.services-swiper').offsetWidth;
        visibleSlides = getVisibleSlidesCount();
        
        if (window.innerWidth < 690) {
            return;
        }
        
        slideWidth = Math.floor((containerWidth - (visibleSlides - 1) * slideMargin) / visibleSlides);
        
        const slides = sliderWrapper.children;
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.width = `${slideWidth}px`;
            slides[i].style.marginRight = `${slideMargin}px`;
        }
        
        const hasEnoughSlides = totalSlides > visibleSlides;
        const needsSlider = visibleSlides === 2;
        
        prevBtn.style.display = (hasEnoughSlides && needsSlider) ? 'flex' : 'none';
        nextBtn.style.display = (hasEnoughSlides && needsSlider) ? 'flex' : 'none';
        
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (currentSlide > maxSlide) {
            currentSlide = maxSlide;
        }
        
        updateSliderPosition();
    }
    
    function updateSliderPosition() {
        if (window.innerWidth < 690) {
            sliderWrapper.style.transform = 'translateX(0)';
            return;
        }
        
        if (totalSlides <= visibleSlides) {
            sliderWrapper.style.transform = 'translateX(0)';
            return;
        }
        
        const offset = -currentSlide * (slideWidth + slideMargin);
        sliderWrapper.style.transform = `translateX(${offset}px)`;
        
        updateButtonsState();
    }
    
    function updateButtonsState() {
        if (totalSlides <= visibleSlides) {
            prevBtn.classList.add('swiper-button-disabled');
            nextBtn.classList.add('swiper-button-disabled');
            return;
        }
        
        prevBtn.classList.toggle('swiper-button-disabled', currentSlide <= 0);
        
        const maxSlide = totalSlides - visibleSlides;
        nextBtn.classList.toggle('swiper-button-disabled', currentSlide >= maxSlide);
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSliderPosition();
        }
    });
    
    totalSlides = sliderWrapper.children.length;
    setSlideWidths();
    
    window.addEventListener('resize', function() {
        setSlideWidths();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderBenefits();
    initForm();
    initServicesSlider();
    
    document.getElementById('reset-data').addEventListener('click', function() {
        const addForm = document.querySelector('.add-form');
        highlightElement(addForm);
        
        localStorage.clear();
        localStorage.setItem('benefits', JSON.stringify(initialBenefits));
        localStorage.setItem('initialDataLoaded', 'true');
        
        showNotification('notification-reset');
        
        renderBenefits();
        
        scrollToTop();
    });
});