const OrdersController = require("../models/order");
const OffersController = require("../models/offers");
const mailer = require("../nodemailer");

const buyProduct = async (req, res) => {
  try {
      for (let orderElement of req.body.product) {
        await OffersController.findByIdAndUpdate(
          {_id: `${orderElement._id}`},
          {$set: {availability: orderElement.availability - 1}}
        )
      }

    const order = new OrdersController({...req.body});
    order.status = "Заказ оформлен";
    order.date = new Date();
    await order.save();
    const message = {
      to: req.body.email,
      subject: 'Congratulations! You have successfully buy a product on our website',
      html: `
        <h1>Поздравляем, Вы успешно оформили заказ на нашем сайте!</h1>

        <i>Информация о вашем заказе:</i>
        <ul>
            <li>Способ оплаты: ${req.body.payment}</li>
            <li>Алресс доставки: город ${req.body.city}, ул.${req.body.street}</li>
        </ul>

        <p>Вы заказали - </p>

            ${req.body.product.map(product => `
                  <table align="left" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                      <td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">
                        &nbsp;
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <table width="600" align="center" border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                    <tr>
                      <td>
                        <table width="600" align="left" border="0" cellpadding="0" cellspacing="0">
                          <tbody>
                          <tr>
                            <td style="font-family: Helvetica, arial, sans-serif; font-size: 18px; color: #282828; text-align:left; line-height: 24px;">
                              ${product.name}
                            </td>
                          </tr>
                          <tr>
                            <td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td style="font-family: Helvetica, arial, sans-serif; font-size: 14px; color: #282828; text-align:left; line-height: 24px;">
                              ${product.description}
                            </td>
                          </tr>
                          <tr>
                            <td width="100%" height="15" style="font-size:1px; line-height:1px; mso-line-height-rule: exactly;">
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table width="180" height="32" bgcolor="#e20404" align="left" valign="middle" border="0" cellpadding="0" cellspacing="0" style="border-radius:3px;" st-button="learnmore">
                                <tbody>
                                <tr>
                                  <td height="14" align="center" valign="middle" style="font-family: Helvetica, Arial, sans-serif; font-size: 13px; font-weight:bold;color: #ffffff; text-align:center; line-height: 14px; -webkit-text-size-adjust:none;" st-title="fulltext-btn">
                                    <p>Цена: ${product.price}</p>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                 <br />
                `)}
        <p>Данное письмо не требует ответа.</p>`
    }
    mailer(message);
    return res.status(201).json({message: "Заказ оформлен", order: order});
  } catch (error) {
    res.status(500).json({message: "ordering --- error", error: error})
  }
}

const getOrders = async (req, res) => {
  try {
    if (Object.keys(req.query).length && req.query.email) {
      const orders = await OrdersController.find({email: req.query.email});
      res.status(200).json({message: "orders received", orders: orders});
    } else if (Object.keys(req.query).length && req.query.dateend === 'null') {
      const orders = await OrdersController.find({
        date: {
          $gte: new Date(req.query.datestart),
        }
      });
      res.status(200).json({message: "orders received", orders: orders});
    } else if (Object.keys(req.query).length && req.query.datestart === 'null') {
      const orders = await OrdersController.find({
        date: {
          $lte: new Date(req.query.dateend),
        }
      });
      res.status(200).json({message: "orders received", orders: orders});
    } else if (Object.keys(req.query).length && req.query.datestart && req.query.dateend) {
      const orders = await OrdersController.find({
        date: {
          $gte: new Date(req.query.datestart),
          $lte: new Date(req.query.dateend),
        }
      });
      res.status(200).json({message: "orders received", orders: orders});
    } else {
      const orders = await OrdersController.find();
      res.status(200).json({message: "orders received", orders: orders});
    }

  } catch (error) {
    res.status(500).json({message: "error", error: error})
  }
}

const editStatus = async (req, res) => {
  try {
    await OrdersController.findOneAndUpdate(
      {_id: req.params.id},
      {$set: {status: req.body.status}},
    )
    const message = {
      to: req.body.email,
      subject: 'Congratulations! Your order status has been updated',
      html: `
      <h1>Поздравляем, Изменился статус вышего заказа</h1>

        <i>Товар который у нас заказали:</i>

            <p>Обновлен статус заказа на: ${req.body.status}</p>

        <p>Данное письмо не требует ответа.</p>`
    }
    mailer(message);
    res.status(200).json({message: "Статус успешно обновлен!"});
  } catch (error) {
    res.status(500).json({message: "edit status --- error", error: error});
  }
};

module.exports = {buyProduct, getOrders, editStatus};
