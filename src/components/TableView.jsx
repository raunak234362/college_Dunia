/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import data from '../data/data.json'
import { FaArrowRight } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'
import { MdCompareArrows } from 'react-icons/md'

const TableView = () => {
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  })
  const [rowLimit, setRowLimit] = useState(10)

  useEffect(() => {
    setTableData(data.tableData)
    setFilteredData(data.tableData)
  }, [])

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1; 
    if (bottom) {
      setRowLimit((prev) => prev + 10);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchQuery(value)
    setFilteredData(
      tableData.filter((college) =>
        college.college.name.toLowerCase().includes(value),
      ),
    )
  }

  const sortData = (key, type = 'string') => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedData = [...filteredData].sort((a, b) => {
      let aValue, bValue

      if (key === 'fees') {
        aValue = a.fees[0].fee['1st Year']
        bValue = b.fees[0].fee['1st Year']
      } else if (key === 'placements') {
        aValue = a.placements['2023']?.average || 0
        bValue = b.placements['2023']?.average || 0
      } else if (key === 'userReview') {
        aValue =
          a.reviews.reduce((acc, review) => acc + review.rating, 0) /
          a.reviews.length
        bValue =
          b.reviews.reduce((acc, review) => acc + review.rating, 0) /
          b.reviews.length
      } else if (key === 'ranking') {
        aValue = a.ranking.find((rank) => rank.year === 2023)?.rank || 100
        bValue = b.ranking.find((rank) => rank.year === 2023)?.rank || 100
      } else if (key === 'cd_rank') {
        // Add sorting for cd_rank
        aValue = a.college.cd_rank || 100
        bValue = b.college.cd_rank || 100
      } else {
        aValue = a.college.name.toLowerCase()
        bValue = b.college.name.toLowerCase()
      }

      if (type === 'number') {
        return direction === 'ascending' ? aValue - bValue : bValue - aValue
      } else {
        if (aValue < bValue) return direction === 'ascending' ? -1 : 1
        if (aValue > bValue) return direction === 'ascending' ? 1 : -1
        return 0
      }
    })

    setFilteredData(sortedData)
  }

  return (
    <div className="bg-white/70 p-5 rounded-lg w-full h-screen overflow-hidden">
      <input
        type="text"
        className="border p-2 mb-4 w-full"
        placeholder="Search by college name..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Sorting Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => sortData('cd_rank', 'number')}
          className="bg-cyan-600/50 text-white px-2 py-2 rounded hover:bg-cyan-600 transition"
        >
          Sort by CD Rank
        </button>
        <button
          onClick={() => sortData('fees', 'number')}
          className="bg-cyan-600/50 text-white px-2 py-2 rounded hover:bg-cyan-600 transition"
        >
          Sort by Fees
        </button>
        <button
          onClick={() => sortData('placements', 'number')}
          className="bg-cyan-600/50 text-white px-2 py-2 rounded hover:bg-cyan-600 transition"
        >
          Sort by Placements
        </button>
        <button
          onClick={() => sortData('userReview', 'number')}
          className="bg-cyan-600/50 text-white px-2 py-2 rounded hover:bg-cyan-600 transition"
        >
          Sort by User Review
        </button>
        <button
          onClick={() => sortData('ranking', 'number')}
          className="bg-cyan-600/50 text-white px-2 py-2 rounded hover:bg-cyan-600 transition"
        >
          Sort by Ranking
        </button>
      </div>

      <div className="mt-5 bg-white h-[75vh] overflow-y-auto" onScroll={handleScroll}>
        <table className="h-fit md:w-full w-[90vw] border-collapse text-center md:text-lg text-xs rounded-xl top-0">
          <thead>
            <tr className="bg-cyan-600/50 text-white text-left">
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => sortData('cd_rank', 'number')}
              >
                CD Rank
              </th>
              <th className="px-2 py-1">Colleges</th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => sortData('fees', 'number')}
              >
                Course Fees
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => sortData('placements', 'number')}
              >
                Placement
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => sortData('userReview', 'number')}
              >
                User Review
              </th>
              <th
                className="px-2 py-1 cursor-pointer"
                onClick={() => sortData('ranking', 'number')}
              >
                Ranking
              </th>
            </tr>
          </thead>
          <tbody className="h-[60vh] overflow-y-auto">
            {filteredData.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="6" className="text-center">
                  No Colleges Found
                </td>
              </tr>
            ) : (
              filteredData.slice(0, rowLimit).map((collegeData) => (
                <tr
                  key={collegeData?.id}
                  className={`hover:bg-gray-100 border text-left ${
                    collegeData?.featured ? 'bg-yellow-200' : ''
                  }`}
                >
                  <td className="border px-2 py-1 ">
                    #{collegeData?.college?.cd_rank}
                  </td>
                  <td className="border px-2 py-1 ">
                    <div>
                      <div className="grid grid-cols-[10%,85%]">
                        <div>
                          <img
                            src={collegeData.college.collegeLogo}
                            alt={collegeData.college.name}
                            className="h-auto w-10 rounded-full inline-block"
                          />
                        </div>
                        <div className="ml-1">
                          <h2 className="font-bold text-base text-cyan-500">
                            {collegeData.college.name}
                          </h2>
                          <h4 className="text-xs">
                            {collegeData.college.location} |{' '}
                            {collegeData.college.affiliations?.join(', ')}
                          </h4>
                          <div className="bg-amber-200 border-l-2 border-orange-500 text-xs">
                            <select className="w-full bg-amber-200">
                              {collegeData.college.courses?.map(
                                (course, index) => (
                                  <option key={index} value={course.name}>
                                    <span className="text-orange-500">
                                      {course?.name}
                                    </span>{' '}
                                    - {course?.exam}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-3 justify-between px-2 text-xs">
                        <div className="text-orange-500 flex items-center gap-1 font-semibold">
                        <FaArrowRight />  Apply Now
                        </div>
                        <div className="text-emerald-500 flex items-center gap-1 font-semibold">
                        <IoMdDownload /> Download Brochure
                        </div>
                        <div className="text-gray-700 flex items-center gap-1 font-semibold">
                        <MdCompareArrows />  Add To Compare
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-sm">
                    <div>
                      <div className="text-emerald-500 font-bold">
                        ₹{collegeData.fees[0].fee['1st Year']}
                      </div>
                      <div>{collegeData.fees[0].name}</div>
                      <div>- 1st Year Fees</div>
                      <div className="text-orange-500 flex items-center gap-1 font-semibold">
                        {' '}
                        <MdCompareArrows /> Compare Fees
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1 text-sm">
                    <div className="text-emerald-500 font-bold">
                      ₹{collegeData.placements['2023']?.average || 'N/A'}
                    </div>
                    <div className="text-xs">Average Package</div>
                    <div className="text-emerald-500 font-bold">
                      ₹{collegeData.placements['2023']?.highest || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-700">Highest Package</div>
                    <div className=" text-orange-500 flex items-center gap-1 font-semibold">
                    <MdCompareArrows />  Compare Placement
                    </div>
                  </td>
                  <td className="border px-2 py-1">
                    <div>
                      <div className="text-sm">
                        {collegeData.reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0,
                        ) / collegeData.reviews.length}
                        /10
                      </div>
                      <div className="text-xs">
                        Based on {collegeData?.reviews.length} user
                      </div>
                      <div className="text-sm font-medium">Reviews</div>
                      <div className="text-xs bg-amber-200 text-orange-500 rounded-full">
                        {collegeData?.reviews
                          ?.slice(0, 1)
                          .map((comment, index) => {
                            return (
                              <div key={index} className="flex justify-center">
                                <div>✓ {comment?.comment?.head}</div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </td>
                  <td className="border px-2 py-1">
                    <div>
                      {collegeData.ranking.find((rank) => rank.year === 2023)
                        ?.rank || 'N/A'}{' '}
                      / 100
                    </div>
                    <div className="flex items-center gap-1">
                      <div>
                        <img
                          className="h-3"
                          src="https://imgs.search.brave.com/jQF8lBuLQX9Y11xYUfFpx6hDjyV_aYJ6VuMMtwhiKpo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9i/L2IzL1RpbWVfTWFn/YXppbmVfbG9nby5z/dmc"
                          alt="logo"
                        />
                      </div>
                      <div className='text-sm'>2023</div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableView
