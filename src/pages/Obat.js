import React, { useState, useEffect } from 'react'
import "../App.css"
import Farmatics from '../assets/F.png'
import CheckList from '../assets/check.png'
import Warning from '../assets/warning.png'
import { Link } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import {db} from '../config/firebase'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { Tooltip } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default function Obat() {

    const auth = getAuth();
    const naviget = useNavigate(); 

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false);

    const handleShowEdit = () => setShowEdit(true)
    const handleEditClose = () => setShowEdit(false);

    const [obats, setObats] = useState([])
    const [createKodeObat, setCreateKodeObat] = useState("")
    const [createNamaObat, setCreateNamaObat] = useState("")
    const [createSediaan, setCreateSediaan] = useState("")
    const [createStok, setCreateStok] = useState("")

    const [updateKodeObat, setUpdateKodeObat] = useState("")
    const [updateNamaObat, setUpdateNamaObat] = useState("")
    const [updateSediaan, setUpdateSediaan] = useState("")
    const [updateStok, setUpdateStok] = useState("")

    const [idUpdated, setIdUpdated] = useState("")

    const collectionRef = collection(db,'obat')

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

    useEffect( () => {
      
      getObats()
    }, [])

    //Add Data
    const submitData = async (e) => {
      e.preventDefault();
      try{
        await addDoc(collectionRef, {
          kodeObat: createKodeObat,
          namaObat: createNamaObat,
          sediaan: createSediaan,
          stok: createStok
        })
        handleClose()
      } catch (err) {
        console.log(err)
      }
      getObats()
    }

    //Delete Data
    const deleteData = async (id) => {
      if( window.confirm('Apakah data ini ingin di hapus?')) {
        try{
          const documentRef = doc(db, "obat", id)
          await deleteDoc(documentRef)
        } catch (err) {
          console.log(err)
        }
        getObats()
      }
    }

    //updateData
    const updateData = async (id) => {
      const obatDocument = doc(db,"obat",id)
      try{
        await updateDoc(obatDocument, {
          kodeObat: updateKodeObat,
          namaObat: updateNamaObat,
          sediaan: updateSediaan,
          stok: updateStok
        })
      }catch (err) {
        console.log(err)
      }
      getObats()
    }
    const [searchObat, setSearchObat] = useState('');
    const handleSearch = (e) => {
        setSearchObat(e.target.value);
      };

  return (
    <>
    {/* Content */}
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
            <i className='fa-solid fa-right-from-bracket me-2'></i>Logout
          </a>
        </div>
        </div>

        <div id='page-content-wrapper' style={{background:"#F2F2F2", height:"20%"}}>

        <nav className='navbar navbar-expand-lg navbar-light bg-tranparent py-4 px-4'>
            <div className='d-flex align-items-center'>
            <h2 className='fs-2 m-0 third-text'>Daftar Obat</h2>
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
                      <div className='d-flex justify-content-between'>
                        <div>
                          <button onClick={handleShow} className='btn btn-primary my-2' data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa-solid fa-circle-plus text-white mx-2 my-2"></i>Tambah Data </button>
                        </div>
                        <div>
                        <input
                            type="text"
                            className="form-control my-3"
                            placeholder="Search Obat..."
                            value={searchObat}
                            onChange={handleSearch}
                        />
                        </div>
                      </div>
                        <table className="table table-borderless bg-blue text-center border border-buttom-0">
                            <thead>
                                <tr className='secondary-bg text-white'>
                                <th scope="col">Kode Obat</th>
                                <th scope="col">Nama Obat</th>
                                <th scope="col">Sediaan</th>
                                <th scope="col">Stok</th>
                                <th scope="col">Status Stok</th>
                                <th scope="col">Aksi</th>
                                </tr>
                            </thead>
                            {obats.filter((obats) =>
                              obats.namaObat.toLowerCase().includes(searchObat.toLowerCase())
                              ).map(({id, kodeObat, namaObat, sediaan, stok}) =>
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
                                <td>
                                    <button className='btn btn-warning' onClick={() => {
                                      handleShowEdit()
                                      setUpdateKodeObat(kodeObat)
                                      setUpdateNamaObat(namaObat)
                                      setUpdateSediaan(sediaan)
                                      setIdUpdated(id)

                                    }}><i className="fa-solid fa-pen-to-square" style={{color: "white"}}></i></button>
                                    <button className='btn btn-danger' onClick={() => deleteData(id)}><i className="fa-solid fa-trash text-white"></i></button>
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
            {/* Add Modal */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Tambah Data Obat</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={submitData}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Kode Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Kode Obat" 
                    onChange={e => setCreateKodeObat(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nama Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Nama Obat" 
                    onChange={e => setCreateNamaObat(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sediaan</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Sediaan" 
                    onChange={e => setCreateSediaan(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Stok</Form.Label>
                    <Form.Control 
                    type="number" 
                    placeholder="Enter Stok"
                    onChange={e => setCreateStok(e.target.value)}/>
                  </Form.Group>
                </Form>  
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={submitData}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            {/* End Add Modal */}


             {/* Edit Modal */}
          <Modal show={showEdit} onHide={handleEditClose}>
              <Modal.Header closeButton>
                <Modal.Title>Update Data Obat</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={() => {
                  updateData(idUpdated)
                  handleEditClose()
                }}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Kode Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Kode Obat" 
                    value={updateKodeObat} 
                    onChange={e => setUpdateKodeObat(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nama Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Nama Obat" 
                    value={updateNamaObat} 
                    onChange={e => setUpdateNamaObat(e.target.value)}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Sediaan</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Sediaan" 
                    value={updateSediaan} 
                    onChange={e => setUpdateSediaan(e.target.value)}/>
                  </Form.Group>
                  
                </Form>  
              </Modal.Body>
              <Modal.Footer>
                <Button type='button' variant="danger" onClick={handleEditClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary" onClick={() => {
                  updateData(idUpdated)
                  handleEditClose()
                }}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            {/* End Edit Modal */}


    </>
  )
}
