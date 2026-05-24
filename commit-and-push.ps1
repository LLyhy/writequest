$env:PATH = "d:\产品\writequest\Git\cmd;" + $env:PATH
Set-Location "d:\产品\writequest"

Write-Host "Checking Git status..."
git status

Write-Host "`nAdding all files..."
git add -A

Write-Host "`nCommitting changes..."
git commit -m "feat: WriteQuest v2.0 - Community features and writing tools

- Add like/unlike functionality for works
- Add comment system with replies
- Add follow/unfollow authors feature
- Add writing templates library (8 templates)
- Add prompt generator with genre/mood/focus options
- Fix login/logout flow stability
- Update Supabase database initialization script
- Add new components: LikeButton, CommentSection, FollowButton, etc."

Write-Host "`nPushing to GitHub..."
git push origin main

Write-Host "`nDone!"
