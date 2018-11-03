from .decorators import error_handler
from .common_functions import string_to_bool, session_scope
from db.schemas.order import Order
from db.schemas.order_item import OrderItem
from interface.schemas.order import OrderSchema
from interface.schemas.order_item import OrderItemSchema

# Business logic for the order module

@error_handler
def get_order(request):
	id = request.args.get("id")
	schema = OrderSchema()

	with session_scope() as session:
		order_object = session.query(Order).get(id)
		order, errors = schema.dump(order_object)

	return order, 200

@error_handler
def edit_order(data):
	return "Okay", 200

@error_handler
def get_all_orders(request):
	status = request.args.get("status", None)
	schema = OrderSchema(many=True, exclude=("order_items",))

	with session_scope() as session:
		if status != None:
			order_objects = session.query(Order).filter(Order.status == status)
		else:
			order_objects = session.query(Order).all()

		orders, errors = schema.dump(order_objects)

	return orders, 200

@error_handler
def get_all_order_items(request):
	status = request.args.get("status", None)
	schema = OrderItemSchema(many=True)

	with session_scope() as session:
		if status != None:
			order_item_objects = session.query(OrderItem).filter(OrderItem.status == status)
		else:
			order_item_objects = session.query(OrderItem).all()

		order_items, errors = schema.dump(order_item_objects)

	return order_items, 200