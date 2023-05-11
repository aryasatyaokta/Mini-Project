import React, { useEffect, useState, Component, useRef } from 'react'
import "../App.css"
import Farmatics from '../assets/F.png'
import { Link } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import {db} from '../config/firebase'
import { collection, getDocs} from 'firebase/firestore'
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js'
import ReactToPrint from 'react-to-print';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

export default function Analytics() {

  const auth = getAuth();
  const naviget = useNavigate();  

  const componentRef = useRef(null);

  const collectionRefStokIn = collection(db,'stokIn')

  const [StokOut, setStokOut] = useState([])
  const collectionRefStokOut = collection(db,'stokOut')

  const handleLogout = () => {
    signOut(auth).then(() => {
      naviget("/login")
    }).catch((error) => {
      console.log(error.code)
    });
    
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(auth.currentUser)
    } else {
      naviget("/")
    }
  });

const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'transparent',
        borderColor: "#1869FF",
        pointBorderColor: 'transparent',
        pointBorderWidth: 4
      }
    ]
  });

  useEffect(() => {
    getStokIn();
  }, []);

  const getStokIn = async () => {
    try {
      const stokInSnapshot = await getDocs(collectionRefStokIn);
      const stokInData = stokInSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      
      const labels = stokInData.map((item) => item.tgl);
      const stockData = stokInData.map((item) => item.stokin);
      
      setData({
        labels: labels,
        datasets: [
          {
            data: stockData,
            backgroundColor: 'transparent',
            borderColor: "#1869FF",
            pointBorderColor: 'transparent',
            pointBorderWidth: 4
          }
        ]
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [data2, setData2] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'transparent',
        borderColor: "#1869FF",
        pointBorderColor: 'transparent',
        pointBorderWidth: 4
      }
    ]
  });

  useEffect(() => {
    getStokOut();
  }, []);

  const getStokOut = async () => {
    try {
      const stokOutSnapshot = await getDocs(collectionRefStokOut);
      const stokOutData = stokOutSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      
      const labels = stokOutData.map((item) => item.tglOut);
      const stockData = stokOutData.map((item) => item.stokOut);
      
      setData2({
        labels: labels,
        datasets: [
          {
            data: stockData,
            backgroundColor: 'transparent',
            borderColor: "#1869FF",
            pointBorderColor: 'transparent',
            pointBorderWidth: 4
          }
        ]
      });
    } catch (err) {
      console.log(err);
    }
  };

  const options = {
    plugins: {
        legend: false
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            min: 2,
            max: 10,
            ticks: {
                stepSize: 2
            }
        }
    }
  };
 
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
                        <div  className="col">
                        <ReactToPrint
                            trigger={() => {
                            return <button className='btn btn-primary'>Print Analysis</button>;
                            }}
                            content={() => componentRef.current}
                            documentTitle='new document'
                            pageStyle="print"
                        />
                            <div className='py-5' ref={componentRef}>
                            <h3>Analysis Data Masuk</h3>
                            <Line data={data} options={options}></Line><br/>
                            <h3>Analysis Data Keluar</h3>
                            <Line data={data2} options={options}></Line>
                            </div>
                        </div>
                       
                    </div>
                    </div>

            </div>

        </div>

    </>
  )
}
