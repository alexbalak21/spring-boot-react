# Spring Boot + React Full-Stack Application

A modern full-stack web application featuring user authentication, post management, and a complete CRUD (Create, Read, Update, Delete) system built with Spring Boot and React.

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.x** - Java web framework
- **Spring Security** - Authentication and authorization
- **JWT** - JSON Web Tokens for stateless authentication
- **Spring Data JPA** - Database access layer
- **H2/MySQL** - Database (configurable)
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## 📁 Project Structure

```
spring-boot-react/
├── src/main/java/app/           # Spring Boot backend
│   ├── controller/              # REST API controllers
│   ├── model/                   # JPA entities
│   ├── repository/              # Data access layer
│   ├── security/                # Security configuration
│   ├── service/                 # Business logic
│   └── config/                  # Application configuration
├── react/                       # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Button.tsx       # Custom button component
│   │   │   ├── Input.tsx        # Custom input component
│   │   │   ├── Toast.tsx        # Toast notification component
│   │   │   ├── ToastContainer.tsx # Toast management
│   │   │   └── Navbar.tsx       # Navigation component
│   │   ├── pages/               # Page components
│   │   │   ├── Posts/           # Post-related pages
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   ├── UpdatePost.tsx
│   │   │   │   └── Posts.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Home.tsx
│   │   │   └── User.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuthorizedApi.ts
│   │   │   ├── useAuthToken.ts
│   │   │   ├── useCsrf.ts
│   │   │   └── useLogout.ts
│   │   ├── context/             # React context providers
│   │   │   └── AuthContext.tsx
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## 🔐 Authentication Flow

### Frontend Authentication
1. **Login/Register**: User submits credentials
2. **Token Storage**: JWT stored in localStorage via `useAuthToken` hook
3. **API Requests**: `useAuthorizedApi` hook automatically includes JWT in requests
4. **Route Protection**: Components check authentication status
5. **Logout**: Token cleared and user redirected

### Key Authentication Components
- `useAuthToken`: Manages JWT storage and retrieval
- `useAuthorizedApi`: Axios instance with automatic token injection
- `AuthContext`: Global authentication state management

## 🏗️ Component Architecture

### Reusable Components

#### Button Component
```tsx
<Button
  variant="primary" | "secondary" | "danger"
  loading={boolean}
  disabled={boolean}
  fullWidth={boolean}
  onClick={handler}
>
  Button Text
</Button>
```

#### Input Component
```tsx
<Input
  label="Field Label"
  type="text|email|password"
  value={value}
  onChange={handler}
  error="Error message"
  disabled={boolean}
/>
```

#### Toast Notifications
```tsx
const toast = useToast();
toast.success("Success message!");
toast.error("Error message!");
toast.warning("Warning message!");
toast.info("Info message!");
```

### Page Components
- **Container Pattern**: Pages use consistent layout with `max-w-7xl mx-auto`
- **Loading States**: Components show loading indicators during API calls
- **Error Handling**: User-friendly error messages with retry options
- **Form Validation**: Client-side validation with visual feedback

## 🔄 CRUD Operations Implementation

### Complete CRUD Example: Posts Management

#### 1. Create (POST)
```tsx
// Frontend - CreatePost.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/posts", {
      title: title.trim(),
      body: body.trim(),
    });
    toast.success("Post created successfully!");
    navigate("/posts");
  } catch (error) {
    toast.error("Failed to create post");
  }
};

// Backend - PostController.java
@PostMapping
public ResponseEntity<Post> createPost(@RequestBody Post post) {
    String username = authenticationFacade.getAuthentication().getName();
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    post.setUser(user);
    Post createdPost = postService.createPost(post);
    return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
}
```

#### 2. Read (GET)
```tsx
// Frontend - Posts.tsx
useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts/my-posts");
      setPosts(response.data);
    } catch (error) {
      setError("Failed to load posts");
    }
  };
  fetchPosts();
}, [api]);

// Backend - PostController.java
@GetMapping("/my-posts")
public ResponseEntity<List<Post>> getCurrentUserPosts() {
    String username = authenticationFacade.getAuthentication().getName();
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    List<Post> posts = postService.getPostsByUserId(user.getId());
    return ResponseEntity.ok(posts);
}
```

#### 3. Update (PUT)
```tsx
// Frontend - UpdatePost.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/posts/${id}`, {
      title: title.trim(),
      body: body.trim(),
    });
    toast.success("Post updated successfully!");
    navigate("/posts");
  } catch (error) {
    setError("Failed to update post");
  }
};

// Backend - PostController.java
@PutMapping("/{id}")
public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
    post.setId(id);
    try {
        Post updatedPost = postService.updatePost(post);
        return ResponseEntity.ok(updatedPost);
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}
```

#### 4. Delete (DELETE)
```tsx
// Frontend - Posts.tsx
const handleDelete = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await api.delete(`/posts/${postId}`);
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    toast.success("Post deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete post");
  }
};

// Backend - PostController.java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deletePost(@PathVariable Long id) {
    postService.deletePost(id);
    return ResponseEntity.noContent().build();
}
```

## 🛠️ How to Implement a New CRUD System

### Step 1: Backend Setup

1. **Create Entity Model**
```java
@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
}
```

2. **Create Repository**
```java
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserId(Long userId);
}
```

3. **Create Service**
```java
@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    public Item updateItem(Item item) {
        return itemRepository.save(item);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<Item> getItemsByUserId(Long userId) {
        return itemRepository.findByUserId(userId);
    }
}
```

4. **Create Controller**
```java
@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationFacade authenticationFacade;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/my-items")
    public ResponseEntity<List<Item>> getCurrentUserItems() {
        String username = authenticationFacade.getAuthentication().getName();
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Item> items = itemService.getItemsByUserId(user.getId());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        String username = authenticationFacade.getAuthentication().getName();
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        item.setUser(user);
        Item createdItem = itemService.createItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        try {
            Item updatedItem = itemService.updateItem(item);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Step 2: Frontend Setup

1. **Create TypeScript Interface**
```tsx
// src/types/Item.ts
export interface Item {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

2. **Create API Constants**
```tsx
// src/pages/Items/constants.ts
export const ITEMS_API = {
  BASE: "/items",
  MY_ITEMS: "/items/my-items",
} as const;
```

3. **Create Item Components**

**List Items Component:**
```tsx
// src/pages/Items/Items.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import { useToast } from "../../components/ToastContainer";
import Button from "../../components/Button";
import { Item } from "../../types/Item";
import { ITEMS_API } from "./constants";

export default function Items() {
  const api = useAuthorizedApi();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.get<Item[]>(ITEMS_API.MY_ITEMS);
      setItems(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await api.delete(`${ITEMS_API.BASE}/${itemId}`);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.success("Item deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete item");
    }
  };

  if (loading) return <div className="text-center py-8">Loading items...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Items</h2>
        <Button onClick={() => navigate("/create-item")}>
          + Create Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/edit-item/${item.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Create Item Component:**
```tsx
// src/pages/Items/CreateItem.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import { useToast } from "../../components/ToastContainer";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { ITEMS_API } from "./constants";

export default function CreateItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useAuthorizedApi();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(ITEMS_API.BASE, {
        name: name.trim(),
        description: description.trim(),
      });

      toast.success("Item created successfully!");
      navigate("/items");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create item";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Create New Item
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter item name"
              required
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border h-32"
                disabled={isSubmitting}
                placeholder="Enter item description"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Item
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

4. **Add Routes to App.tsx**
```tsx
import Items from "./pages/Items/Items";
import CreateItem from "./pages/Items/CreateItem";
import UpdateItem from "./pages/Items/UpdateItem";

// Add to Routes:
<Route path="/items" element={<Items />} />
<Route path="/create-item" element={<CreateItem />} />
<Route path="/edit-item/:id" element={<UpdateItem />} />
```

5. **Update Navbar (if needed)**
```tsx
{authenticated && (
  <>
    {/* ... existing links */}
    <Link to="/items" className={/* styling */}>Items</Link>
    <Link to="/create-item" className={/* styling */}>Create Item</Link>
  </>
)}
```

## 🎯 Best Practices

### Frontend
- **Type Safety**: Use TypeScript interfaces for all data models
- **Error Handling**: Always handle API errors gracefully
- **Loading States**: Show loading indicators during async operations
- **Optimistic Updates**: Update UI immediately, rollback on error
- **Toast Notifications**: Use toasts for user feedback instead of alerts
- **Form Validation**: Validate on both client and server side
- **Consistent Styling**: Use Tailwind classes and component variants

### Backend
- **RESTful APIs**: Follow REST conventions for endpoints
- **Proper HTTP Status Codes**: Use appropriate status codes
- **Input Validation**: Validate all inputs on the server
- **Authentication**: Secure endpoints with proper authentication
- **Error Responses**: Return meaningful error messages
- **Pagination**: Implement pagination for large datasets

### General
- **Separation of Concerns**: Keep business logic separate from presentation
- **Reusable Components**: Build reusable UI components
- **Custom Hooks**: Extract complex logic into custom hooks
- **Environment Variables**: Use env vars for configuration
- **Code Organization**: Maintain clear folder structure

## 🚀 Getting Started

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd spring-boot-react
   ./mvnw spring-boot:run
   ```
3. **Frontend Setup**:
   ```bash
   cd react
   npm install
   npm run dev
   ```
4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Posts Endpoints
- `GET /api/posts` - Get all posts
- `GET /api/posts/my-posts` - Get current user's posts
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

This README provides a comprehensive guide for understanding and extending this full-stack CRUD application. The patterns and practices demonstrated here can be applied to implement any type of CRUD system in your applications.
