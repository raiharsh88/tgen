
-- postgres table to store website scraped data
create table if not exists scraped_data(
    title varchar(255),
    page_data varchar(100000),
    created_at timestamp default current_timestamp,
    id uuid not null
 )