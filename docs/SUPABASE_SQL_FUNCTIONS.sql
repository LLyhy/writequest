-- 补充SQL函数 - 用于计数器

-- 增加作品浏览量
create or replace function increment_view(work_id uuid)
returns void as $$
begin
  update published_works
  set views = views + 1
  where id = work_id;
end;
$$ language plpgsql;

-- 增加作品点赞数
create or replace function increment_likes(work_id uuid)
returns void as $$
begin
  update published_works
  set likes = likes + 1
  where id = work_id;
end;
$$ language plpgsql;

-- 减少作品点赞数
create or replace function decrement_likes(work_id uuid)
returns void as $$
begin
  update published_works
  set likes = greatest(0, likes - 1)
  where id = work_id;
end;
$$ language plpgsql;

-- 增加作品评论数
create or replace function increment_comments(work_id uuid)
returns void as $$
begin
  update published_works
  set comments_count = comments_count + 1
  where id = work_id;
end;
$$ language plpgsql;

-- 删除作品时自动删除相关评论和点赞 (可选)
create or replace function delete_work_cascade()
returns trigger as $$
begin
  delete from comments where work_id = old.id;
  delete from likes where work_id = old.id;
  return old;
end;
$$ language plpgsql;

create trigger delete_work_cascade
  before delete on published_works
  for each row
  execute function delete_work_cascade();
