@echo off
cd /d "d:\产品\writequest"
git add -A
git commit -m "feat: WriteQuest v2.0 - Community features and writing tools

- Add like/unlike functionality for works
- Add comment system with replies
- Add follow/unfollow authors feature
- Add writing templates library (8 templates)
- Add prompt generator with genre/mood/focus options
- Fix login/logout flow stability
- Update Supabase database initialization script
- Add new components: LikeButton, CommentSection, FollowButton, etc."
git push origin main
pause
