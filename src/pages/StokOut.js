import React, { useEffect, useState } from 'react'
import Farmatics from '../assets/F.png'
import { Link } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import { collection, doc, getDocs} from 'firebase/firestore'
import {db} from '../config/firebase'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Tooltip } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import CheckList from '../assets/check.png'
import Warning from '../assets/warning.png'
import '../App.css'

export default function Pemasukan() {

    const auth = getAuth();
    const naviget = useNavigate();
    

    const [showEditStok, setShowEditStok] = useState(false);

    const handleShowEditStok = () => setShowEditStok(true)
    const handleEditCloseStok = () => setShowEditStok(false);


    const [obats, setObats] = useState([])
    const collectionRef = collection(db,'obat')
    const [obatId, setObatId] = useState()

    const [StokOut, setStokOut] = useState([])
    const collectionRefStokOut = collection(db,'stokOut')

    const [createStokOut, setCreateStokOut] = useState("")
    const [createNameObatOut, setCreateNameObatOut] = useState("")
    const [createTglOut, setCreateTglOut] = useState("")

    const [updateDataStok, setUpdateDataStok] = useState()
    const [updateDataNamaObat, setUpdateDataNamaObat] = useState("")

    const [idUpdatedStok, setIdUpdatedStok] = useState("")

    const handleLogout = () => {
      signOut(auth).then(() => {
        // Sign-out successful.
        naviget("/login")
      }).catch((error) => {
        console.log(error.code)
      });
      
    }
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(auth.currentUser)
      } else {
        naviget("/login")
      }
    });

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
        setObats(obatData)
      }).catch((err) => {
          console.log(err)
      })
    }

    const getStokOut = async ()  => {
        await getDocs(collectionRefStokOut).then( (stokOut) =>{
        let stokOutData = stokOut.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setStokOut(stokOutData)
      }).catch((err) => {
          console.log(err)
      })
    }

    const updateStokInOut = async (idObat) => {
      const obatDocument = doc(db,"obat",idObat)
      let oldStok = ""
      obats.map(({ id, stok }) => {
        console.log("ID OBAT", id)
        if (id === idObat) {
          oldStok = stok;
        }
        return null;
      });
      
      try{
        console.log("asmui",oldStok)
        let stok = parseInt(oldStok) - parseInt(updateDataStok)
        await updateDoc(obatDocument, {
          namaObat: updateDataNamaObat,
          stok: stok
        })
      }catch (err) {
        console.log(err)
      }
      getObats()
    }

    const deleteData = async (id) => {
      if( window.confirm('Apakah data ini ingin di hapus?')) {
        try{
          const documentRef = doc(db, "stokOut", id)
          await deleteDoc(documentRef)
        } catch (err) {
          console.log(err)
        }
        getStokOut()
      }
    }

    const submitStokOut = async () => {;
      try{
        await addDoc(collectionRefStokOut, {
          nameObat: createNameObatOut,
          stokOut: createStokOut,
          tglOut: createTglOut
        })
        handleEditCloseStok()
      } catch (err) {
        console.log(err)
      }
      getStokOut()
      
    }

    const [searchObat, setSearchObat] = useState('');
    const handleSearch = (e) => {
        setSearchObat(e.target.value);
      };
    useEffect( () => {
      getStokOut()
      getObats()
    }, [])
  return (
    <>
        <div className='d-flex' id='wrapper'>
        
        <div className='bg-white p-5 third-text bg-white border border-white fixed-start mt-4 mb-4' style={{borderRadius:"30px", marginLeft:"20px"}}>
        <div className='sidebar-heading text-center fs-2 d-flex'>
            <img src={Farmatics} alt=""/>
            <i className='p-2'></i> Farmatics
        </div>
        <div className='list-group list-group-flush my-5'>
          <Link to="/" className='text-decoration-none border-none'>
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
            <i className='fa-solid fa-right-from-bracket me-2' ></i>Logout
          </a>
        </div>
        </div>

        <div id='page-content-wrapper' style={{background:"#F2F2F2", height:"20%"}}>

        <nav className='navbar navbar-expand-lg navbar-light bg-tranparent py-4 px-4'>
            <div className='d-flex align-items-center'>
            <h2 className='fs-2 m-0 third-text'>Stok Obat Keluar</h2>
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
            <input
                  type="text"
                  className="form-control my-3 w-25 mx-4"
                  placeholder="Search Obat..."
                  value={searchObat}
                  onChange={handleSearch}
                />
                <div className="row my-5">
                      {obats.filter((obats) =>
                      obats.namaObat.toLowerCase().includes(searchObat.toLowerCase())
                      ).map(({id, namaObat, sediaan, stok}) =>
                      <Card onClick={() => {
                        handleShowEditStok()
                        setUpdateDataStok(stok)
                        setUpdateDataNamaObat(namaObat)
                        setIdUpdatedStok(id)

                      }}
                      className='col-md-4 my-4 mx-2' 
                      style={{ width: '18rem', borderRadius: "20px", cursor:"pointer" }}>
                        <Card.Body>
                          <Card.Title>{namaObat}</Card.Title>
                          <div className='d-flex'>
                          <Card.Text className=' mt-2'>
                            Sediaan <br/><br/>
                            {sediaan}
                          </Card.Text>
                          <Card.Text className='mt-2 mx-4'>
                            Stok <br/> <br/>
                            {stok}
                          </Card.Text>
                          <Card.Text className=' mt-2'>
                          Status <br/> <br/>
                          {stok <= 3 ? (
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
                          </Card.Text>
                          </div>
                        </Card.Body>
                      </Card>
                      )}
                    {/* </div> */}
                   
                </div>
                <table className="table table-borderless bg-blue text-center border border-buttom-0 my-3">
                            <thead>
                                <tr className='secondary-bg text-white'>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Stok Keluar</th>
                                <th scope="col">Tanggal Keluar</th>
                                <th scope='col'>Aksi</th>
                                </tr>
                            </thead>
                            {StokOut.map(({ id, stokOut, tglOut, nameObat }) => {
                                let formattedDate = tglOut; // Default value if tglOut is already a Date object

                                if (tglOut instanceof Date) {
                                    const date = tglOut;
                                    formattedDate = date.toLocaleDateString();
                                } else if (tglOut && typeof tglOut.toDate === 'function') {
                                    const date = tglOut.toDate(); // Convert tglOut to a Date object
                                    formattedDate = date.toLocaleDateString();
                                }

                                return (
                                    <tbody>
                                    <tr className='bg-white' key={id}>
                                        <td>{nameObat}</td>
                                        <td>{stokOut}</td>
                                        <td>{formattedDate}</td>
                                        <button className='btn btn-danger text-black' onClick={() => deleteData(id)}>Delete</button>
                                    </tr>
                                    </tbody>
                                );
                            })}


                        </table>
                        {/* coba */}
            </div>

        </div>

        </div>

        {/* Edit Stok Modal */}
        <Modal show={showEditStok} onHide={handleEditCloseStok}>
              <Modal.Header closeButton>
                <Modal.Title>Tambah Stok Keluar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={() => {
                  updateStokInOut(idUpdatedStok)
                  handleEditCloseStok()
                  submitStokOut()
                }}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nama Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Nama Obat" 
                    onChange={e => {
                      setUpdateDataNamaObat(e.target.value) 
                      setCreateNameObatOut(e.target.value)
                      }}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Jumlah Stok Keluar</Form.Label>
                    <Form.Control 
                    type="number" 
                    placeholder="Enter Stok" 
                    onChange={e => { 
                      setUpdateDataStok(e.target.value)
                      setCreateStokOut(e.target.value)}}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tanggal Stok Keluar</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Enter Tanggal Keluar"
                    onChange={e => setCreateTglOut(e.target.value)}/>
                  </Form.Group>
                </Form>  
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleEditCloseStok}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {
                   submitStokOut()
                  updateStokInOut(idUpdatedStok)
                  handleEditCloseStok()
                }}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
    </>
  )
}
