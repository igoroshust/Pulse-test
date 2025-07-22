import React from 'react';

const Footer = () => {
    return (
        <footer class="py-4 bg-light mt-auto">
            <div class="container-fluid px-4">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted">Разработано &copy; ОПТ</div>
                        <div>
                            <a href="#">Политика конфиденциальности</a>
                            {/* Дополнительные документы */}
                            {/* &middot; */}
                            {/* <a href="#">Terms &amp; Conditions</a> */}
                        </div>
                    </div>
             </div>
         </footer>
    );
};

export default Footer;