import React, { useEffect, useState } from 'react'
import "../App.css"
import Farmatics from '../assets/F.png'
import { Link } from 'react-router-dom';
import GbDashboard from '../assets/dashboard.png'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import {db} from '../config/firebase'
import { collection, getDocs} from 'firebase/firestore'
import { Tooltip } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import CheckList from '../assets/check.png'
import Warning from '../assets/warning.png'

export default function Dashboard() {
   
  const auth = getAuth();


  const naviget = useNavigate();  
  
  const [obats, setObats] = useState([])
  const collectionRef = collection(db,'obat')

  const handleLogout = () => {
    signOut(auth).then(() => {
      naviget("/login")
    }).catch((error) => {
      console.log(error.code)
    });
    
  }

 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(auth.currentUser);
      } else {
        naviget('/');
      }
    });
  }, [auth, naviget]);

  const warningTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
     Stok Hampir Habis
    </Tooltip>
   );

   const checkTooltip = (props) => (
     <Tooltip id="button-tooltip" {...props}>
      Stok Aman
     </Tooltip>
    );

  const getObats = async () => {
    await getDocs(collectionRef).then( (obat) =>{
      let obatData = obat.docs.map((doc) => ({...doc.data(), id: doc.id}))
      const sortedData = obatData.sort((a, b) => parseInt(a.stok) - parseInt(b.stok));
      setObats(sortedData)
    }).catch((err) => {
        console.log(err)
    })
  }

  useEffect( () => {
    getObats()
  }, [])

  // useEffect(() => {
  //   naviget('/');
  // }, [naviget]);
  
  return (
  <>
   <div className='d-flex' id='wrapper'>
    
      <div className='bg-white p-5 third-text border border-white fixed-start mt-4 mb-4' style={{borderRadius:"30px", marginLeft:"20px"}}>
        <div className='sidebar-heading text-center fs-2 d-flex'>
          <img src={Farmatics} alt=""/>
          <i className='p-2'></i> Farmatics
        </div>
        <div className='list-group list-group-flush my-5'>
          <Link to="/" className='text-decoration-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
            <i className='fa-solid fa-laptop me-2'></i>Dashboard
            </a>
          </Link>
          <Link to="/obat" className='text-decoration-none border-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-3 border-0'>
                <i className='fa-solid fa-notes-medical me-2'></i>Obat
            </a>
          </Link>
          <Link to="/obat-masuk" className='text-decoration-none border-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
                <i className='fas fa-chart-line me-2'></i>Stok In
            </a>
          </Link>
          <Link to="/obat-keluar" className='text-decoration-none border-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
                <i className='fas fa-chart-line me-2'></i>Stok Out
            </a>
          </Link>
          <Link to="/analytics" className='text-decoration-none border-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
                <i className='fas fa-chart-line me-2'></i>Analytics
            </a>
          </Link>
          <a onClick={handleLogout} href='#' className='list-group-item list-group-item-action bg-transparent text-danger py-5'>
            <i className='fa-solid fa-right-from-bracket me-2'></i>Logout
          </a>
        </div>
      </div>

      <div id='page-content-wrapper' style={{background:"#F2F2F2", height:"20%"}}>

        <nav className='navbar navbar-expand-lg navbar-light bg-tranparent py-4 px-4'>
          <div className='d-flex align-items-center'>
            <h2 className='fs-2 m-0 third-text'>Dashboard</h2>
          </div>


          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                          {auth && (
                          <p>
                          <i className="fas fa-user me-2"></i>{auth?.currentUser?.email?.split("@")[0]}
                          </p>
                          )}
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container-fluid px-4">

                <div className="row my-5">
                    <div className="col">
                       <div className='d-flex'>
                        <div>
                            <h3 className='py-5 third-text'>Selamat Datang di Inventaris Farmatics</h3>
                            <div className='d-flex'>
                            <div className="col-md-3 text-center" style={{width:"70%"}}>
                              <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center" style={{borderRadius:"15px"}}>
                              
                              <div>
                                  <h3 className="fs-2">{obats.length}</h3>
                                  <p className="fs-5">Jenis Obat</p>
                              </div>
                              <i className="fa-solid fa-notes-medical fs-1 primary-text border rounded-full secondary-bg p-3" ></i>
                              </div>
                            </div>

                   
                            </div>
                        </div>
                        <img src={GbDashboard} alt="" style={{width: "40%"}}/>
                       </div>
                       <table className="table table-borderless bg-blue text-center border border-buttom-0 my-3">
                            <thead>
                                <tr className='secondary-bg text-white'>
                                <th scope="col">Kode Obat</th>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Sediaan</th>
                                <th scope="col">Stok</th>
                                <th scope="col">Status Stok</th>
                                </tr>
                            </thead>
                            {obats.map(({id, kodeObat, namaObat, sediaan, stok}) =>
                            <tbody>
                                <tr className='bg-white' key={id}>
                                <td>{kodeObat}</td>
                                <td>{namaObat}</td>
                                <td>{sediaan}</td>
                                <td>{stok}</td>
                                <td>{stok <= 3 ? (
                                  <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={warningTooltip}
                                >
                                  <img src={Warning} alt="" /></OverlayTrigger>
                                ) : (
                                  <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={checkTooltip}
                                >
                                  <img src={CheckList} alt="" /></OverlayTrigger>
                                )}
                                </td>
                                </tr>
                            </tbody>
                            )}
                        </table>
                    </div>
                </div>

            </div>

      </div>

   </div>

  </>


  )
}
