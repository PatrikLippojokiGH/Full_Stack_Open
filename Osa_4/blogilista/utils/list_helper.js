const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)


}

const favoriteBlog = (blogs) => {

    const reducer = (fav, item) => {
        if (fav.likes < item.likes) return item
        else return fav
    }

    const zeroLikesBlog = 
        {
            title: "There are no blogs with likes",
            author: "There are no blogs with likes",
            likes: 0
        }

    return blogs.reduce(reducer, zeroLikesBlog)

}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) {
        const zero = 
        {
            author: "",
            blogs: 0
        }
        return zero
    }

    const authors = []

    const blogCount = []

    const mapper = (blog) => {
        if (authors.includes(blog.author)) {
            blogCount[authors.indexOf(blog.author)] = blogCount[authors.indexOf(blog.author)] + 1
        }
        else {
            authors.push(blog.author)
            blogCount.push(1)
        }
    }

    blogs.map(mapper)

    const reducer = (most,item) => {
        if(most > item) return most
        else return item
    }

    const index = blogCount.indexOf(blogCount.reduce(reducer,0))

    const most = 
    {
        author: authors[index],
        blogs: blogCount[index]
    }

    return most
    
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) {
        const zero = 
        {
            author: "",
            likes: 0
        }
        return zero
    }

    const authors = []

    const likeCount = []

    const mapper = (blog) => {
        if (authors.includes(blog.author)) {
            likeCount[authors.indexOf(blog.author)] = likeCount[authors.indexOf(blog.author)] + blog.likes
        }
        else {
            authors.push(blog.author)
            likeCount.push(blog.likes)
        }
    }

    blogs.map(mapper)

    const reducer = (most,item) => {
        if(most > item) return most
        else return item
    }

    const index = likeCount.indexOf(likeCount.reduce(reducer,0))

    const most = 
    {
        author: authors[index],
        likes: likeCount[index]
    }

    return most
    
}
  
module.exports = {
dummy,
totalLikes,
favoriteBlog,
mostBlogs,
mostLikes
}