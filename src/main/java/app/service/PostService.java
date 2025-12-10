package app.service;

import app.model.Post;
import app.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUser_Id(userId);
    }

    public Post createPost(Post post) {
        // Additional business logic can be added here
        return postRepository.save(post);
    }

    public Post updatePost(Post post) {
        // Check if post exists
        return postRepository.findById(post.getId())
                .map(existingPost -> {
                    existingPost.setTitle(post.getTitle());
                    existingPost.setBody(post.getBody());
                    // Note: createdAt should not be updated
                    return postRepository.save(existingPost);
                })
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + post.getId()));
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
