import "./MainModal.css"

function MainModal(){
return(
    <div className="modal fade" id="MainModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="MainModalLongTitle"> </h5>
          <button type="button" id="MainModalClose" className="btn-close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body" id="MainModalMessage">
        </div>
      </div>
    </div>
  </div>
  );
 
}


 function showModal(title,content){
    let Mainmodal = document.getElementById('MainModal');
    let Mainbtnclose = document.getElementById('MainModalClose');
    Mainmodal.style.display = "block";
    Mainmodal.style.paddingRight = "17px";
    Mainmodal.className="modal fade show";
    document.getElementById('MainModalLongTitle').innerHTML= title;
    document.getElementById("MainModalMessage").innerHTML= content;
    Mainbtnclose.addEventListener('click', (e) => {
        Mainmodal.style.display = "none";
      Mainmodal.className="modal fade";
    });
 }

 export { MainModal,showModal };