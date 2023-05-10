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

    const [StokIn, setStokIn] = useState([])
    const collectionRefStokIn = collection(db,'stokIn')

    const [createStokIn, setCreateStokIn] = useState("")
    const [createNameObat, setCreateNameObat] = useState("")
    const [createTgl, setCreateTgl] = useState("")

    const [updateDataStok, setUpdateDataStok] = useState("")
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

    const getStokIn = async ()  => {
        await getDocs(collectionRefStokIn).then( (stokIn) =>{
        let stokInData = stokIn.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setStokIn(stokInData)
      }).catch((err) => {
          console.log(err)
      })
    }

    const updateStokInOut = async (id) => {
      const obatDocument = doc(db,"obat",id)
      try{
        await updateDoc(obatDocument, {
          namaObat: updateDataNamaObat,
          stok: updateDataStok
        })
      }catch (err) {
        console.log(err)
      }
      getObats()
    }

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

    const submitStokIn = async (e) => {
      e.preventDefault();
      try{
        await addDoc(collectionRefStokIn, {
          nameObat: createNameObat,
          stokin: createStokIn,
          tgl: createTgl
        })
        handleEditCloseStok()
      } catch (err) {
        console.log(err)
      }
      getStokIn()
      
    }

    const [searchObat, setSearchObat] = useState('');
    const handleSearch = (e) => {
        setSearchObat(e.target.value);
      };
    useEffect( () => {
      getStokIn()
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
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
                <i className='fa-solid fa-notes-medical me-2'></i>Obat
            </a>
          </Link>
          <Link to="/obat-masuk" className='text-decoration-none border-none'>
            <a href='#' className='list-group-item list-group-item-action bg-transparent second-text py-4 border-0'>
                <i className='fas fa-chart-line me-2'></i>Stok
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
            <h2 className='fs-2 m-0 third-text'>Stok Obat</h2>
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
                                <th scope="col">Stok In</th>
                                <th scope="col">Tanggal Masuk</th>
                                <th scope='col'>Aksi</th>
                                </tr>
                            </thead>
                            {StokIn.map(({ id, stokin, tgl, nameObat }) => {
                              const date = tgl.toDate();
                              // Format tanggal dalam bentuk string
                              const formattedDate = date.toLocaleDateString();
                              return (
                                <tbody>
                                  <tr className='bg-white' key={id}>
                                    <td>{nameObat}</td>
                                    <td>{stokin}</td>
                                    <td>{formattedDate}</td>
                                    <button className='btn btn-danger' onClick={() => deleteData(id)}><i className="fa-solid fa-trash"></i></button>
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
                <Modal.Title>Tambah Data Obat</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={() => {
                  updateStokInOut(idUpdatedStok)
                  handleEditCloseStok()
                  submitStokIn()
                }}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nama Obat</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Nama Obat" 
                    value={updateDataNamaObat}
                    onChange={e => {
                      setUpdateDataNamaObat(e.target.value) 
                      setCreateNameObat(e.target.value)
                      }}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Stok</Form.Label>
                    <Form.Control 
                    type="number" 
                    placeholder="Enter Stok" 
                    onChange={e => { 
                      setUpdateDataStok(e.target.value)
                      setCreateStokIn(e.target.value)}}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Stok</Form.Label>
                    <Form.Control 
                    type="date" 
                    placeholder="Enter Tanggal Masuk"
                    onChange={e => setCreateTgl(e.target.value)}/>
                  </Form.Group>
                </Form>  
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleEditCloseStok}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {
                   submitStokIn()
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
