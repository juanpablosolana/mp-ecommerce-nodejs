const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181'
});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});
app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.get('/preference',function (req,res){
    const { title, picture_url, quantity, price } = req.query
   // console.log(title,picture_url, quantity, price);
  let preference = {
        items: [
            {
                "id": 1234,
                title,
                picture_url,
                "description": "Dispositivo móvil de Tienda e-commerce",
                "quantity": Number(quantity),
                "unit_price": Number(price),
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": Number(22223333)
            },
            "address": {
                "zip_code": "1111",
                "street_name": "Falsa",
                "street_number": Number(123)
            },
            "email": "test_user_81131286@testuser.com",
            "name": "Lalo",
            "surname": "Landa"
        },
        back_urls: {
            "success": "https://mercado-pago-checkout-pro.vercel.app/api/feedback",
            "failure": "https://mercado-pago-checkout-pro.vercel.app/api/feedback",
            "pending": "https://mercado-pago-checkout-pro.vercel.app/api/feedback"
        },
        "auto_return": "approved",
        "payment_methods": {
            "excluded_payment_methods": [
                {
                    "id": "amex"
                }
            ],
            "excluded_payment_types": [
                {
                    "id": "atm",
                }
            ],
            "installments": 6
        },
        external_reference: "juanpablosolana@gmail.com",
        notification_url: "https://mercado-pago-checkout-pro.vercel.app/api/webhook",
    };
    mercadopago.preferences.create(preference)
        .then(function (response) {
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
           global.id = response.body.id;
            //console.log(response.body.id);
            res.redirect(`https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${response.body.id}`)
        }).catch(function (error) {
            console.log(error);
        });
    });

app.listen(port);