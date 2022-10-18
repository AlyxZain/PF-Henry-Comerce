/** @format */
import { useEffect, useState } from "react";
import "./ProductsDetails.scss";
import { MdRemove, MdAdd } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { Link, /* Navigate */ 
useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClothingDetail } from "../../redux/actions/actions";
import { Loading } from "../Loading/Loading";
import { getClothing, clearState } from "../../redux/actions/actions";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { toast } from "react-toastify";
import { Notify } from "../Notify/Notify";
import { PostReview } from "../PostReview/PostReview";
import { checkAuth, postReview } from "../../redux/actions/actions";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { deleteReview } from "../../redux/actions/actions";

export const ProductsDetails = () => {
  const navigate = useNavigate()
  let auth;
  useEffect(() => {
    if (localStorage.getItem("authenticated")) {
      const { authenticated, isAdmin } = JSON.parse(
        localStorage.getItem("authenticated")
      );
      auth = JSON.parse(localStorage.getItem("authenticated"));
      dispatch(checkAuth(auth));
    }

    const profile = async () => {
      const { email, token } = auth;
      const user = await axios.get(
        `http://localhost:3001/api/user/info/${email}`,
        {
          headers: { "x-access-token": `${token}` },
        }
      );

      setData(user.data);
    };
    profile();
  }, []);

  const [data, setData] = useState("");

  const detail = useSelector((state) => state.detail);
  const limitUsers =
    detail.comments && detail.comments.find((e) => e.user === data.username);
  console.log(limitUsers);
  const allProducts = useSelector((state) => state.allClothing);
  const dispatch = useDispatch();
  const { id, name } = useParams();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    dispatch(getClothingDetail(id));
    dispatch(getClothing(name));
    dispatch(clearState());
  }, [dispatch]);

  const [count, setCount] = useState(0);

  const [stockk, setStock] = useState(1);

  const [size, setSize] = useState();

  const [pricee, setPrice] = useState(detail.price);

  const [product, setProduct] = useState([]);

  const recomended = Object.values(allProducts).filter(
    (e) => e.category === detail.category
  );

  const [cart, setCart] = useState(false);

  let lsCart = JSON.parse(localStorage.getItem("lsCartProducts")) || [];

  const mezcla = `${detail.name}-${size}`;

  const success = () =>
    toast.success("Producto añadido con exito", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });

  const error = () =>
    toast.error(
      "Ya contiene este producto en su talle, por favor modifiquelo desde el carrito",
      {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      }
    );

  let handleAddToCart = (e) => {
    if (
      count > 0 &&
      size &&
      lsCart.filter((element) => element.cartId === mezcla).length === 0
    ) {
      let prodToCart = {
        cartId: `${detail.name}-${size}`,
        id: detail._id,
        name: detail.name,
        image: detail.image,
        price: detail.price,
        pricee,
        count,
        size,
        stockk,
        categoria: detail.category,
        idRemove: `${detail.name}-${size}`,
      };
      e.preventDefault();
      lsCart.push(prodToCart);
      localStorage.setItem(`lsCartProducts`, JSON.stringify(lsCart));
      success();
    } else {
      error();
    }
  };

  let printStock = [detail.stock];

  const selectSize = (e) => {
    if (printStock[0][e.target.value] === 0) {
      setCount(0);
      setPrice(0);
    } else {
      setStock(printStock[0][e.target.value]);
      setCount(1);
      setPrice(detail.price);
    }
    setSize(e.target.value);
  };

  const sumStock = (e) => {
    if (count === 0) {
      return;
    }
    if (count >= stockk) {
      return;
    } else {
      setCount(count + 1);
      setPrice(pricee + detail.price);
    }
  };

  const downStock = () => {
    if (count < 1) {
      return;
    }
    if (count === 1) {
      return;
    } else {
      setCount(count - 1);
      setPrice(pricee - detail.price);
    }
  };

  const selectedSize = (e) => {
    if (size === e) {
      return false;
    } else {
      return true;
    }
  };

  const [session, setSession] = useState(false);

  useEffect(() => {
    setSession(JSON.parse(localStorage.getItem("authenticated")));
  }, [localStorage.getItem("authenticated")]);

  const status = useSelector((state) => state.status);
  useEffect(() => {}, [status]);

  const deleteClick = (e) => {
    const obj = {
      email: data.email,
      isDeleting: true,
    }
    dispatch(deleteReview(id,obj));
    navigate(0);
  };

  return (
    <div>
      {detail.length === 0 && <Loading />}
      <Notify />
      <section className="pt-6"></section>
      <div className="container has-text-left pt-6">
        <div className="columns">
          <div className="column is-half border-rigth filee">
            <section className="pl-6"></section>
            <img className="" src={detail.image} alt="" />
          </div>

          <div className="column is-two-fifths pl-6">
            <h1 className="pt-1 pl-6 title has-text-weight-bold mb-5 has-text-left">
              {detail.name}
            </h1>
            <h1 className=" pl-6 has-text-weight-bold mb-6">
              {detail.category}
            </h1>
            <section className="pt-5"></section>

            <div className="pl-6 pr-6">
              {detail.stock
                ? Object.keys(detail.stock).map((e, index) => {
                    return (
                      <button
                        onClick={selectSize}
                        value={e}
                        key={index}
                        className={
                          selectedSize(e)
                            ? "button  mr-4 has-text-weight-bold "
                            : "button  is-dark mr-4 has-text-weight-bold "
                        }
                      >
                        {e}
                      </button>
                    );
                  })
                : null}
            </div>
            <div className="pt-1 pl-6  has-text-weight-bold  has-text-left  mb-6"></div>

            <h3 className="pt-1 pl-6 title has-text-weight-bold mb-4 has-text-left">
              Quantity products
            </h3>
            <div className="column is-2-desktop is-3-tablet pl-6 ">
              <div
                className="is-inline-flex is-align-items-center has-text-weight-bold pl-1 mb-4"
                style={{
                  border: "1px solid #DBDDE1",
                  borderRadius: "8px",
                }}
              >
                <button
                  onClick={downStock}
                  className="button has-text-black is-ghost "
                >
                  <MdRemove />
                </button>
                <button
                  className="button px-2 py-4 has-text-centered"
                  style={{
                    width: "48px",
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }}
                  type="number"
                  placeholder="1"
                  value={count}
                >
                  {count}
                </button>
                <button
                  onClick={sumStock}
                  className="button has-text-black is-ghost"
                >
                  <MdAdd />
                </button>
              </div>
            </div>
            <div className="pl-6 pt-4">
              <p>{detail.description}</p>
            </div>
            <div className="pt-2 pl-6 pb-6 border-bottom"></div>
            <section className="pt-6"></section>
            <div className="pl-6 pr-6 card-header-title ">
              <p className="pr-6 title has-text-weight-bold mb-0 is-inline-block">
                ${pricee}
              </p>
              <p className="control">
                <Link className="button is-primary" to="">
                  <span className="icon">
                    <FaShoppingCart className="fas" />
                  </span>
                  <span onClick={(e) => handleAddToCart(e)}>Add to cart</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="pt-6"></section>
      <section className="pt-6"></section>

      <div className="columns is-centered">
        <div className="column is-11 background-a is-centered">
          <div className="columns is-centered">
            <div className="column is-11  background-c">
              <div className="filee is-centered border-bottom">
                <h3 className="pt-1 pl-6 p title  mb-4 has-text-left">
                  RECOMMENDED PRODUCTS
                </h3>
              </div>
              <div className="">
                <Carousel responsive={responsive}>
                  {recomended.map((e, index) => (
                    <div
                      key={index}
                      className="fileee pt-6 has-text-centered has-text-weight-bold is-flex-direction-column"
                    >
                      <a href={"http://127.0.0.1:5173/products/" + e.name}>
                        <img
                          className=" image "
                          width="200"
                          height="120"
                          src={e.image}
                          alt=""
                        />
                        <p>{e.name}</p>
                        <p className="pt-3">{e.price}</p>
                      </a>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

          <section className="pt-6"></section>
          <section className="pt-6"></section>
          <section className="pt-6"></section>

          <div className="columns is-centered">
            <div className="column is-9">
              <div className="filee is-centered  is-justify-content-flex-start"></div>
              <div className="is-flex-direction-row pt-6 has-text-centered background-e">
                <div className="columns is-centered">
                  <div className="column  has-text-left bt">
                    <div className="has-text-left ">
                      <section className=" ">
                        <div className="column is-12">
                          <h3 className="title is-size-3 has-text-centered">
                            REVIEWS
                          </h3>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                {detail.comments ? (
                  detail.comments.map((e, index) => (
                    <div key={index} className=" pt-2 pb-2 border-bottom">
                      <div className="columns pt-3 pb-4">
                        <div className="column fileee is-one-quarter ">
                          {/* <h1 className= "has-text-weight-bold is-size-5 pr-3">Usuario:</h1> */}
                          <h1 className="title is-size-5">{e.user}</h1>
                        </div>
                        <div className="pl-6 column ">
                          <h1 className="pt-0 title is-size-4 ">{e.title}</h1>
                        </div>
                        <div className="column is-1">
                          {session?.authenticated === true &&
                          session.isAdmin ===
                            true /* || limitUsers && limitUsers.user === data.username */ ? (
                            <button className="button is-danger">X</button>
                          ) : null}
                        </div>
                      </div>
                      <div className="columns is-vcentered pt- pb-0">
                        <div className="column zzz is-one-quarter ">
                          <h1 className="has-text-weight-bold is-size-5 pr-3"></h1>
                          <h1 className="title is-size-5">
                            {e.rating}
                            <FaStar
                              className="pt-3"
                              size={24}
                              color={"#FFBA5A"}
                            />
                          </h1>
                        </div>
                        <div className="pl-6 column ">
                          <p className="is-size-6 has-text-centered">
                            {e.description}
                          </p>
                        </div>
                        <div className="column is-1"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className=" pt-6">
                    <h1 className="title is-size-5 is-vcentered">
                      No contamos con reviews hasta al momento :(
                    </h1>
                  </div>
                )}
                <div className="has-text-centered pt-6 pb-6">
                  <PostReview />
                  {limitUsers && limitUsers.user === data.username ? (
                    <div>
                      <button onClick={(e) => deleteClick(e)} className="button is-danger">
                        Borrar tu review
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
              <section className="pt-6"></section>
              <section className="pt-6"></section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
