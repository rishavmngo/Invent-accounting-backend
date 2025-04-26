CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);


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
