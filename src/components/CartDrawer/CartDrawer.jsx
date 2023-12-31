import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CartItem from '../CartItem';
import { Drawer, Badge, Box } from '@mui/material';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormatPrice } from 'src/utils/formatPrice';
import { clearCart } from 'src/redux/reducer/cartSlice';
import EmptyCartImage from 'src/assets/cart-empty.png';
import { toast } from 'react-toastify';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { carts } = useSelector((state) => state.cart);

  const getTotalBill = () => {
    const totalBill = carts.reduce((accumulator, cartItem) => {
      return accumulator + cartItem.price * (1 - cartItem.percentSale) * cartItem.quantity;
    }, 0);
    return FormatPrice(totalBill);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Xóa giỏ hàng thành công');
  };

  const renderCarts = (carts) => {
    return carts.map((cartItem, index) => {
      return <CartItem key={index} cartItem={cartItem} />;
    });
  };

  // Cart
  const [state, setState] = useState({
    right: false
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  return (
    <div className='flex items-center flex-col'>
      <div>
        <Badge badgeContent={carts.length} color='primary'>
          <IconButton onClick={toggleDrawer('right', true)}>
            <AddShoppingCartIcon color='primary' />
          </IconButton>
        </Badge>
        <Drawer
          sx={{ position: 'relative' }}
          anchor='right'
          open={state['right']}
          onClose={toggleDrawer('right', false)}
        >
          <Box sx={{ width: 500, p: 4, overflowY: 'auto' }}>
            <div className='flex items-center justify-between pb-6'>
              <h4 className='text-xl font-bold text-cyan-700'> Giỏ hàng</h4>
              <IconButton onClick={toggleDrawer('right', false)}>
                <ChevronRightIcon sx={{ color: 'rgb(14, 116 ,144)' }} />
              </IconButton>
            </div>
            {carts.length > 0 ? (
              <>
                <div className='flex justify-end pb-4'>
                  <Button
                    onClick={handleClearCart}
                    sx={{ borderColor: 'red', color: 'red' }}
                    size='small'
                    variant='outlined'
                  >
                    Xóa tất cả giỏ hàng
                  </Button>
                </div>
                <div className='mb-48'>{renderCarts(carts)}</div>
              </>
            ) : (
              <>
                <div className='flex items-center justify-center'>
                  <img src={EmptyCartImage} alt='cart-empty' className='' />
                </div>
                <p className='text-center '>Giỏ hàng đang trống !</p>
              </>
            )}
          </Box>
          {carts.length > 0 && (
            <div className='border-t border-gray-200 px-4 py-6 sm:px-6 absolute bottom-0 left-0 right-0 bg-white'>
              <div className='flex justify-between text-base font-medium text-gray-900'>
                <p>Giá trị đơn hàng</p>
                <p>{getTotalBill()} đ</p>
              </div>
              <p className='mt-0.5 text-sm text-gray-500'>Vận chuyển và thuế được tính khi thanh toán</p>
              <div className='mt-6'>
                {user ? (
                  <Link
                    to='/checkout'
                    onClick={toggleDrawer('right', false)}
                    className='w-full flex items-center justify-center rounded-md border border-transparent bg-[#da291c] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#eb574c]'
                  >
                    Thanh toán
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      toast.error('Bạn phải đăng nhập để thanh toán !');
                    }}
                    className='w-full flex items-center justify-center rounded-md border border-transparent bg-[#da291c] px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#eb574c]'
                  >
                    Thanh toán
                  </button>
                )}
              </div>
              <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                <button type='button' className='font-medium text-[#da291c]' onClick={toggleDrawer('right', false)}>
                  Tiếp tục mua hàng
                  <span aria-hidden='true'> &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default CartDrawer;
