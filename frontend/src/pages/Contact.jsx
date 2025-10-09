import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faUser, 
  faMessage, 
  faPaperPlane, 
  faPhone,
  faMapMarkerAlt,
  faShieldAlt
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes - in a real app, you'd send to your backend
        console.log("Form submitted:", formData);
        
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } catch (error) {
        console.error("Form submission failed", error);
        setErrors({ general: "Failed to send message. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-5xl text-[#218EA6]" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about SafeWatch? We're here to help. Reach out to our team for support, 
            feedback, or partnership opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="md:col-span-1 bg-[#2a2a2a] p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-[#218EA6]">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#218EA6]/20 p-3 rounded-full mr-4 w-12 h-12 flex items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#218EA6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Our Location</h3>
                  <p className="text-gray-400 mt-1">123 Safety Street, Tech Hub, Bangalore</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#218EA6]/20 p-3 rounded-full mr-4 w-12 h-12 flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#218EA6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <p className="text-gray-400 mt-1">support@safewatch.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#218EA6]/20 p-3 rounded-full mr-4 w-12 h-12 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="text-[#218EA6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Call Us</h3>
                  <p className="text-gray-400 mt-1">+91 98765 43210</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-[#218EA6]/20 p-3 rounded-full hover:bg-[#218EA6]/40 transition-all">
                  <svg className="w-5 h-5 text-[#218EA6]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-[#218EA6]/20 p-3 rounded-full hover:bg-[#218EA6]/40 transition-all">
                  <svg className="w-5 h-5 text-[#218EA6]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="bg-[#218EA6]/20 p-3 rounded-full hover:bg-[#218EA6]/40 transition-all">
                  <svg className="w-5 h-5 text-[#218EA6]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-[#218EA6]/20 p-3 rounded-full hover:bg-[#218EA6]/40 transition-all">
                  <svg className="w-5 h-5 text-[#218EA6]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2 bg-[#2a2a2a] p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            {submitSuccess && (
              <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded mb-6">
                Your message has been sent successfully! We'll get back to you soon.
              </div>
            )}
            
            {errors.general && (
              <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`appearance-none rounded-lg relative block w-full px-10 py-3 border ${
                      errors.name ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800'
                    } placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#218EA6] focus:border-transparent`}
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className={`appearance-none rounded-lg relative block w-full px-10 py-3 border ${
                      errors.email ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800'
                    } placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#218EA6] focus:border-transparent`}
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faMessage} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={`appearance-none rounded-lg relative block w-full px-10 py-3 border ${
                      errors.subject ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800'
                    } placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#218EA6] focus:border-transparent`}
                  />
                </div>
                {errors.subject && <p className="mt-2 text-sm text-red-400">{errors.subject}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Your Message"
                    className={`appearance-none rounded-lg relative block w-full px-4 py-3 border ${
                      errors.message ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800'
                    } placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#218EA6] focus:border-transparent`}
                  ></textarea>
                </div>
                {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message}</p>}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#218EA6] to-[#1a6c7e] hover:from-[#30b0d1] hover:to-[#218EA6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#218EA6] transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Map or Additional Info Section */}
        <div className="mt-20 max-w-6xl mx-auto bg-[#2a2a2a] p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#218EA6] mb-2">How does SafeWatch work?</h3>
              <p className="text-gray-400">
                SafeWatch uses AI-powered computer vision to monitor public spaces, detect potential threats, 
                and alert authorities when necessary. Our system analyzes gender distribution and behavioral patterns 
                to identify situations that may pose risks to women's safety.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#218EA6] mb-2">Is my privacy protected?</h3>
              <p className="text-gray-400">
                Yes, privacy is our priority. SafeWatch does not store personal identification data and 
                all analysis is done in real-time. We comply with data protection regulations and use 
                anonymized data for statistical purposes only.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#218EA6] mb-2">How can I implement SafeWatch?</h3>
              <p className="text-gray-400">
                SafeWatch can be integrated with existing CCTV systems or deployed as a standalone solution. 
                Contact our team for a consultation on how to implement SafeWatch in your area or organization.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#218EA6] mb-2">Do you offer support?</h3>
              <p className="text-gray-400">
                Yes, we provide 24/7 technical support for all our clients. Our team is always available 
                to address any issues or questions you may have about the SafeWatch system.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
