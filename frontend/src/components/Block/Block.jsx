import React from 'react';

const Block = ({ title, value, onClick, bgColor }) => {
    return (
               <div className={`col-xl-3 col-md-6`}>
                  <div className={`card ${bgColor} text-white mb-4`} onClick={onClick}>
                    <div className="card-body">{title}</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">{value}</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
               </div>
    );
};

export default Block;