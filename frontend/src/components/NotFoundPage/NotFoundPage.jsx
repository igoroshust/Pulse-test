import React from 'react';
import Footer from './../Footer/Footer';

const NotFoundPage = () => {
    return (
         <div id="layoutError">
            <div id="layoutError_content">
                <main>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-6">
                                <div class="text-center mt-4">
                                    <img class="mb-4 img-error" src="assets/img/error-404-monochrome.svg" />
                                    <p class="lead">Страница не найдена</p>
                                    <a href="/">
                                        <i class="fas fa-arrow-left me-1"></i>
                                        Вернуться на главную
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        <Footer />
      </div>
    );
};

export default NotFoundPage;