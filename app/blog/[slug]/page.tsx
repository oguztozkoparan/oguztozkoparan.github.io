import { notFound } from "next/navigation";
import BlogPost from "../../../components/blog-post";

// Sample blog post data - in a real app, this would come from a CMS or database
const blogPosts = {
  "modern-web-development": {
    id: "modern-web-development",
    title: "The Future of Modern Web Development",
    content: `
      <h2>Introduction</h2>
      <p>The landscape of web development is constantly evolving, with new technologies and methodologies emerging at an unprecedented pace. As we look toward the future, several key trends are shaping how we build and interact with web applications.</p>
      
      <h2>AI Integration in Development</h2>
      <p>Artificial Intelligence is no longer just a buzzword in web development. From AI-powered code completion tools like GitHub Copilot to automated testing and deployment processes, AI is becoming an integral part of the developer workflow.</p>
      
      <blockquote>
        <p>"The future of web development lies in the seamless integration of AI tools that enhance developer productivity while maintaining code quality and security."</p>
      </blockquote>
      
      <h2>Performance-First Architecture</h2>
      <p>Modern web applications must be fast, responsive, and efficient. This means adopting performance-first architectural patterns such as:</p>
      
      <ul>
        <li>Server-side rendering (SSR) and static site generation (SSG)</li>
        <li>Edge computing and CDN optimization</li>
        <li>Progressive Web App (PWA) capabilities</li>
        <li>Advanced caching strategies</li>
      </ul>
      
      <h2>The Rise of Component-Driven Development</h2>
      <p>Component-driven development has revolutionized how we think about building user interfaces. Tools like Storybook, design systems, and atomic design principles are becoming standard practice.</p>
      
      <h2>Conclusion</h2>
      <p>The future of web development is bright, with exciting technologies and methodologies on the horizon. By staying informed and adapting to these changes, developers can create more efficient, scalable, and user-friendly applications.</p>
    `,
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Development",
    tags: ["React", "Performance", "AI", "Future"],
    author: "Oguz Tozkoparan",
  },
  "design-systems-guide": {
    id: "design-systems-guide",
    title: "Building Scalable Design Systems",
    content: `
      <h2>What is a Design System?</h2>
      <p>A design system is a comprehensive set of standards, components, and guidelines that ensure consistency across digital products. It serves as a single source of truth for design and development teams.</p>
      
      <h2>Key Components of a Design System</h2>
      <p>Every effective design system should include:</p>
      
      <ul>
        <li><strong>Design Tokens:</strong> The atomic elements like colors, typography, and spacing</li>
        <li><strong>Component Library:</strong> Reusable UI components with clear documentation</li>
        <li><strong>Guidelines:</strong> Usage patterns and best practices</li>
        <li><strong>Tools:</strong> Design and development resources</li>
      </ul>
      
      <h2>Implementation Strategy</h2>
      <p>Building a design system requires careful planning and execution. Start small with core components and gradually expand based on team needs and feedback.</p>
      
      <blockquote>
        <p>"A design system is never finished. It's a living, breathing entity that evolves with your product and organization."</p>
      </blockquote>
      
      <h2>Measuring Success</h2>
      <p>Track the adoption and effectiveness of your design system through metrics like component usage, design consistency scores, and development velocity improvements.</p>
    `,
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Design",
    tags: ["Design Systems", "UI/UX", "Figma", "Components"],
    author: "Oguz Tozkoparan",
  },
  "glassmorphism-trends": {
    id: "glassmorphism-trends",
    title: "Glassmorphism in Modern UI Design",
    content: `
      <h2>Understanding Glassmorphism</h2>
      <p>Glassmorphism is a design trend that creates a frosted glass effect, combining transparency, blur, and subtle borders to create depth and hierarchy in user interfaces.</p>
      
      <h2>Key Characteristics</h2>
      <p>The glassmorphism aesthetic is defined by several key visual elements:</p>
      
      <ul>
        <li>Semi-transparent backgrounds</li>
        <li>Backdrop blur effects</li>
        <li>Subtle borders and shadows</li>
        <li>Layered depth perception</li>
      </ul>
      
      <h2>Implementation Best Practices</h2>
      <p>When implementing glassmorphism in your designs, consider accessibility and performance implications. Ensure sufficient contrast for readability and optimize blur effects for performance.</p>
      
      <h2>CSS Implementation</h2>
      <pre><code>
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
      </code></pre>
      
      <h2>Future of Glassmorphism</h2>
      <p>As browser support for backdrop-filter improves and design tools evolve, glassmorphism will continue to be a popular choice for creating modern, sophisticated interfaces.</p>
    `,
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Design",
    tags: ["Glassmorphism", "CSS", "Trends", "UI Design"],
    author: "Oguz Tozkoparan",
  },
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <BlogPost post={post} />
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}
