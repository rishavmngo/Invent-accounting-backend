create table sessions(
id UUID primary key,
user_id integer,
expirty_date timestamp not null,
constraint fk_user_session
	foreign key(user_id)
	references users(id)
	on delete cascade
)

CREATE TYPE stock_transaction_type AS ENUM ('add', 'reduce', 'sale', 'purchase', 'open','payable','receivable');
CREATE TABLE party(
id serial PRIMARY KEY,
user_id integer NOT NULL,
name VARCHAR (50) NOT NULL,
contact_number VARCHAR(15),
billing_address VARCHAR(100),
email_address VARCHAR(100),
state VARCHAR(25),
gst_type VARCHAR(100),
gstin VARCHAR(15),
credit_limit int,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP,
CONSTRAINT fk_user_party
	FOREIGN KEY(user_id)
	REFERENCES users(id)
	ON DELETE CASCADE 
)


CREATE TABLE party_opening_balance(
id serial PRIMARY KEY,
party_id integer NOT NULL,
TYPE stock_transaction_type NOT NULL,
amount INT NOT NULL,
as_of_date TIMESTAMP NOT NULL DEFAULT NOW(),
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP,
CONSTRAINT fk_party_opening_balance
	FOREIGN KEY(party_id)
	REFERENCES party(id)
	ON DELETE CASCADE 
)



CREATE TABLE item(
id SERIAL PRIMARY KEY,
user_id integer NOT NULL,
name VARCHAR(50) NOT NULL,
code VARCHAR(50),
category VARCHAR(50),
description VARCHAR(100),
hsn_code VARCHAR(50),
sale_price integer,
purchase_price integer,
discount integer,
tax_rate VARCHAR(50),
min_stock_qty integer,
LOCATION VARCHAR(100),
CONSTRAINT fk_user_item
	FOREIGN KEY(user_id)
	REFERENCES users(id)
	ON DELETE CASCADE
)


CREATE TABLE item_stock(
id SERIAL PRIMARY KEY,
item_id integer NOT NULL,
type VARCHAR(150) NOT NULL,
quantity integer NOT NULL,
description VARCHAR(100),
purchase_price integer,
as_of_date TIMESTAMP NOT NULL DEFAULT NOW(),
LOCATION VARCHAR(100),
CONSTRAINT fk_user_item
	FOREIGN KEY(item_id)
	REFERENCES item(id)
	ON DELETE CASCADE
)




SELECT
	item_id,
	SUM(CASE 
			WHEN type IN('add','opening_stock') THEN quantity
			WHEN type = 'reduce' THEN -quantity
			ELSE 0
			END) AS current_quantity
FROM 
item_stock
WHERE item_id = 3
GROUP BY 
item_id;



CREATE TABLE invoice(
id SERIAL PRIMARY KEY,
owner_id integer NOT NULL,
party_id integer NOT NULL,
contact_number varchar(12),
total_amount integer,
paid_amount integer,
full_paid boolean,
due_date TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP,
CONSTRAINT fk_party_invoice
	FOREIGN KEY(party_id)
	REFERENCES party(id)
	ON DELETE CASCADE,
CONSTRAINT fk_users_invoice
	FOREIGN KEY(owner_id)
	REFERENCES users(id)
	ON DELETE CASCADE
)

CREATE TABLE invoice_item(
id SERIAL PRIMARY KEY,
item_id integer,
invoice_id integer,
quantity integer,
price_per_unit integer,
discount integer,
tax integer,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP,
CONSTRAINT fk_invoice_invoice_item
	FOREIGN KEY(invoice_id)
	REFERENCES invoice(id)
	ON DELETE CASCADE,
CONSTRAINT fk_item_invoice_item
	FOREIGN KEY(item_id)
	REFERENCES item(id)
	ON DELETE CASCADE
)


SELECT 
  i.id AS invoice_id,
  i.owner_id,
  i.customer_id,
  i.total_amount,
  i.created_at,
  p.id AS party_id,
  p.name AS party_name,
  p.contact_number  AS party_contact,
  ii.item_id,
  it.name AS item_name,
  ii.price_per_unit,
  ii.quantity,
  ii.discount,
  ii.tax 
FROM invoice i 
LEFT JOIN invoice_item ii ON i.id = ii.invoice_id
LEFT JOIN party p  ON p.id = i.id
LEFT JOIN item it ON it.id = ii.item_id 
WHERE i.owner_id = 4
ORDER BY i.id;




CREATE TABLE templates(
	id SERIAL PRIMARY KEY,
	name varchar(50),
	thumbnail text,
	template text,
	premium boolean,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP
)


CREATE TABLE settings(
	id SERIAL PRIMARY KEY,
	owner_id integer,
	logo_url text,
	template_id integer,
	dark_mode boolean,
	name varchar(100),
	contact_number varchar(12),
	address text,
	website text,
	signature_url text,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	CONSTRAINT fk_users_settings
		FOREIGN KEY(owner_id)
		REFERENCES users(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_templates_settings
		FOREIGN KEY(template_id)
		REFERENCES templates(id)
		ON DELETE CASCADE
)
