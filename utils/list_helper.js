const dummy = posts => {
  posts = 1
  return posts
}

const totalLikes = posts => {
  let sum = 0
  posts.map(b => Number(b.likes)).forEach(e => sum += e )
  return sum
}

const favoritepost = posts => {
  let post = posts.length <= 0 ? {}: posts[0]
  posts.filter(b => post = post.likes > b.likes ? post: b)
  return post
}

const mostposts = posts => {
  if(posts.length === 0) return {}
  let aposts = posts.map(b => b.author)
  
  return maxFreq(aposts)
}

const mostLikes = posts => {
  if(posts.length === 0) return {}
  let lposts = posts.map(b => ({author: b.author, likes: b.likes}))
    
  return maxLikes(lposts)
}

const maxLikes = (arr) => {
  let mf = 0, m = 0, item = arr[0].author
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i].author === arr[j].author) m+=arr[j].likes
      if (mf < m) {
        mf = m
        item = arr[i].author
      }
    }
  
    m = 0
  }
  return ({author: item, likes: mf})
}

const maxFreq = (arr) => {
  let mf = 1, m = 0, item = arr[0]

  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i] === arr[j]) m++
      if (mf < m) {
        mf = m
        item = arr[i]
      }
    }

    m = 0
  }
  return ({author: item, posts: mf})
}

module.exports = {
  dummy,
  totalLikes,
  favoritepost,
  mostposts,
  mostLikes
}