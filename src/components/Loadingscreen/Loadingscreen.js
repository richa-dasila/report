import './Loadingscreen.css'

function Loadingscreen(){

    return(
        <>
            <div id="loadingscreen"  className="invisible d-flex justify-content-center align-items-center container-fluid  h-100 position-absolute top-0 start-0 bg-light">
                <div id="spinnercontainer" className='container d-flex justify-content-center'>
                    <div id="loadingscreenspinner" className="d-block spinner-border spinner-border-lg"  role="status"></div>
                    <div className='d-block ms-3 d-flex text-center justify-content-center align-items-center'>
                        <span id="loadertext" className='h4'><em></em></span>
                    </div>
                </div>
            </div>            
        </>
    );

}

function activateloadingscreen(stringl){
    document.getElementById("loadingscreen").classList.remove("invisible");
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    document.getElementById("loadertext").innerHTML=`<em>`+stringl+`</em>`;
}

function deactivateloadingscreen(){
    document.getElementById("loadingscreen").classList.add("invisible");
    document.body.style.overflow = 'visible';
}


export { Loadingscreen, activateloadingscreen, deactivateloadingscreen};